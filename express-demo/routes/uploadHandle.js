let express = require('express');
let  uploadHandle = express.Router();
const fse = require('fs');
const path=require('path');
const multiparty=require('multiparty');
const chunkDirPath = path.resolve(__dirname, '../public/target/');
//获取文件名和文件的扩展名
const changeFilename=(filename='')=>{
	const extension=filename.slice(filename.lastIndexOf('.')+1,filename.length);
	const name=filename.slice(0,filename.lastIndexOf('.'));
	return {expr:extension,name:name};
}

//秒传函数
uploadHandle.post('/verify',async(req,res,next)=>{
	const createList=async(filePath)=>{
		let arr=await fse.readdirSync(filePath);
		console.log(arr,'arr')
		return arr;
	}
	const {filename,fileHash}=req.body;		//filename=文件的名字，fileHash=文件的MD5 hash值
	const {expr,name}=changeFilename(filename);
	const filePath=path.resolve(chunkDirPath,`${fileHash}${expr}`);
	console.log(filePath)
	if(!fse.existsSync(filePath)){		//找不到文件夹，说明没上传过
		return res.json({
			status: 200,
			shouldUpload:false,
		});
	}else{		//找的到文件夹，读文件名
		return res.json({
			status: 200,
			shouldUpload:true,
			uploadList:await createList(filePath)
		});
	}
})

//接受前端上传的文件
uploadHandle.post('/upload', async function(req,res,next){
	const multipart=new multiparty.Form();		//stream ended unexpectedly
	multipart.uploadDir = path.resolve(__dirname,"../public/target","..");
	multipart.parse(req,async (err,fields,files)=>{
		if(err){
			console.log('err:',err);
			return ;
		};
		const [chunk] =files.chunk;		
		const [hash] =fields.hash;		//hash=文件名+索引
		const [fileHash] =fields.fileHash;
		const [filename]=fields.filename;
		const {name,expr}=changeFilename(filename);
		const chunkDir=path.resolve(__dirname,'../public/target/',`${fileHash}${expr}`);		//新建资源的文件夹
		if(!fse.existsSync(chunkDir)){
			await fse.mkdirSync(chunkDir);
		}
    await fse.renameSync(chunk.path,`${chunkDir}/${hash}`);
    return res.send({
      code: 200,
      msg: "received file chunk"
    });
	})
});
//处理分片合并接口
uploadHandle.post('/merge', async function(req, res, next) {
	const pipStream = (path, writeStream) => {
		return new Promise(resolve => {
			const readStream = fse.createReadStream(path);
			readStream.on("end", function(err){
				if(err) throw err;
				console.log('end',path)
				// fse.unlinkSync(path);
				resolve();
			});
			readStream.pipe(writeStream,{end:false});
		})
	};
	const mergeFileChunk = (filePath, filename,fileHash,expr,name,size) => {
		const cD =path.resolve(chunkDirPath,`${name}.${expr}`);		//cD是要写入的文件
		fse.readdir(filePath,async function(err,chunkPaths){
			chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);		//根据索引值排序
			 Promise.all(
				chunkPaths.map((chunkPath, index) => {
					return pipStream(path.resolve(filePath,chunkPath), fse.createWriteStream(cD, {
						start: index * size,
						end: (index + 1) * size
					}))
				})
			).then(()=>{
				// fse.rmdirSync(filePath);
			});
		});
	}
	const resolvePost = req => {
		return new Promise(resolve => {
			let chunk = '';
			req.on("data", data => {
				chunk += data;
			});
			req.on("end", () => {
				resolve(JSON.parse(chunk));
			})
		})
	}
	const data = await resolvePost(req).then(async data=>{
		console.log(data)
		const {filename,size,fileHash} = data;
		const {name,expr}=changeFilename(filename);
		const filePath = path.resolve(chunkDirPath,`${fileHash}${expr}`);	
		await mergeFileChunk(filePath, filename,fileHash,expr,size);
		res.end(JSON.stringify({
			code: 200,
			msg: "file merged success"
		}))
});


	// const {filename,size,fileHash} = req.body;
	// const {name,expr}=changeFilename(filename);
	// const filePath = path.resolve(chunkDirPath,`${fileHash}${expr}`);	
	// await mergeFileChunk(filePath, filename,fileHash,expr,name,size);
	// return res.end(JSON.stringify({
	// 	code: 200,
	// 	msg: "file merged success"
	// }))
});

module.exports = uploadHandle;