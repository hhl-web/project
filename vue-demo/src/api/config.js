let baseURL;
if(process.env.NODE_ENV==='development'){
	baseURL='http://localhost:3000'
}
export {baseURL}