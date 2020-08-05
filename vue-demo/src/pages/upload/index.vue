<template>
  <div class="app">
    <input type="file" @change="handleFileChange" />
    <el-button @click="handleUpload">上传</el-button>
    <el-button @click="cancelUpload">暂停上传</el-button>
    <el-button @click="resumelUpload">恢复上传</el-button>
    <div>
      <div>{{uploadPercentage}}</div>
      <ul>
        <li v-for="(item,index) in data"
            :key="index">{{item.hash}}-----------{{item.precentage}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import SparkMD5 from 'spark-md5';
const SIZE = 3 * 1024 * 1024;
	//获取本地缓存数据
	// function getUploadedFormStorage(){
	// 	return JSON.parse(localStorage.getItem('saveChunkKey') || '{}');
	// }
	// //写入缓存
	// function setUploadedToStorage(fileHash,index){
	// 	let obj=getUploadedFormStorage();
	// 	console.log(obj)
	// 	if(!obj[fileHash]){
	// 		obj[fileHash]={};
	// 	}
	// 	obj[fileHash][index]=true;
	// 	localStorage.setItem('saveChunkKey',JSON.stringify(obj));
	// }
export default {
    name:'App',
    data(){
        return {
          container: {
						file: null
					},
					data:[],
					ary:[],
        }
		},
		computed:{
			uploadPercentage(){
				if(!this.container.file || (!this.data.length)) return 0;
				const loaded =this.data.map(item=>item.chunk.size * item.precentage).reduce((pre,cur)=>pre+cur);
				return parseInt((loaded/this.container.file.size).toFixed(2));
			}
		},
		methods: {
			request({
					url,
					method = 'post',
					data,
					headers = {},
					onProgress=e=>e,
					onAbort=xhr=>xhr,
			}){
				return new Promise(resolve => {
					const xhr = new XMLHttpRequest();
					xhr.upload.onprogress=onProgress;
					onAbort(xhr);
					xhr.withCredentials = true;
					xhr.open(method, url);
					Object.keys(headers).forEach(key => {
						xhr.setRequestHeader(key, headers[key]);
					});
					xhr.send(data);
					xhr.onload = e => {
						this.ary=this.ary.filter(item=>item!==xhr);
						resolve({
							data: e.target.response
						})
					}
				})
			},
			//生成文件切片
			createFileChunk(file, size = SIZE) {
				const fileChunk = [];		//切片的数组，长度代表分几个切片
				let cur = 0;
				while (cur < file.size) {
					fileChunk.push({
						file: file.slice(cur, cur + size)
					});
					cur += size;
				}
				return fileChunk;
			},
			handleFileChange(e) {
				const [file] = e.target.files;
				if (!file) return;
				// Object.assign(this.$data, this.$options.data());
				this.container.file = file;
      },
      //
			uploadChunks(uploadList=[]) {
				const requestList = this.data.filter(({hash})=>!uploadList.includes(hash)).map(({
					chunk,
					hash,
					index,
					fileHash
				}) => {
					const formData = new FormData();
					formData.append("chunk", chunk);
					formData.append("hash", hash);
					formData.append("index", index);
					formData.append("fileHash", fileHash);
					formData.append("filename", this.container.file.name);
					return {
						formData,
						index
					}
				}).map(({
					formData,
					index
				}) => {
					return this.request({
						url: "http://localhost:3000/api/uploadHandle/upload",
						data: formData,
						onProgress:this.createProgressHandler(this.data[index]),
						onAbort:this.createCancelHandler
					})
				});
				Promise.all(requestList).then(res=>{
					console.log(res)
					if(uploadList.length+requestList.length===this.data.length){
						this.mergeRequest();
					}
				}); //并发切片

			},
			//点击上传处理函数
			async handleUpload() {
				if (!this.container.file) return;
				const fileChunkList = this.createFileChunk(this.container.file);
				this.container.fileHash=await this.createMd5(fileChunkList);
				const {shouldUpload,uploadList}=await this.verifyUpload(this.container.file.name,this.container.fileHash);
				if(shouldUpload){
					this.$message.success("秒传成功~~");
					return ;
				}
				this.data = fileChunkList.map(({file},index) => {
							return {
								fileHash:this.container.fileHash,		//2227885a7cb9b9e078d3a24d5543c945-4
								chunk: file,  //文件
								index:index,  //索引
								hash: this.container.file.name + '-' + index ,//文件名+数组下标
								precentage:0,
							}
						}); 
				await	this.uploadChunks(uploadList);
			},
			//取消上传的函数
			createCancelHandler(xhr){
				this.ary.push(xhr);
			},
			//点击取消函数
			cancelUpload(){
				this.ary.forEach(xhr=>xhr.abort());
				this.ary=[];
			},
			//恢复上传
			async resumelUpload(){
				const {uploadList} =await this.verifyUpload(this.container.file.name,this.container.fileHash);
				await this.uploadChunks(uploadList)
			},
			//合并函数
			mergeRequest(){
				this.request({
					url:'http://localhost:3000/api/uploadHandle/merge',
					data:JSON.stringify({
						size:SIZE,
						filename:this.container.file.name,
						fileHash:this.container.fileHash
          }),
          // headers:{
					// 	"Content-Type":"application/json"
					// },
				})
			},
			createProgressHandler(item){
				return e=>{
					item.precentage=parseInt(String((e.loaded / e.total)*100))
				}
			},
			createMd5(fileChunkList=[]){
				let currentChunk=0,md5;
				let reader=new FileReader();
				let spark = new SparkMD5.ArrayBuffer();	
				function readFile(){
					if(fileChunkList[currentChunk].file){
						reader.readAsArrayBuffer(fileChunkList[currentChunk].file)
					}
				}
				readFile();
				return new Promise(resolve=>{
					reader.onload=e=>{
						// console.log(e)
						currentChunk++;
						spark.append(e.target.result);
						if(currentChunk<fileChunkList.length){
							readFile();
						}else{
							md5=spark.end();
							resolve(md5);
						}
					};
				})
			},
			async verifyUpload(filename,fileHash){
				const {data} =await this.request({
					url:'http://localhost:3000/api/uploadHandle/verify',
					// headers:{
					// 	"Content-Type":"application/json"
					// },
					data:JSON.stringify({
						filename,
						fileHash
					})
				});
				console.log(data)
				return JSON.parse(data);
			},
	},
}
</script>

<style lang="scss">
/* 改变主题色变量 */
$--color-primary: teal;
/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-ui/lib/theme-chalk/fonts';
@import "~element-ui/packages/theme-chalk/src/index";
</style>
