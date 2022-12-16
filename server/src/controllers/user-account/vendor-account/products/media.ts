const uploadProductMedia = (req: any, res: any) => {
	console.log('req.file %o', req.file);
	console.log('req.body %o', req.body);
	res.send();
};

export { uploadProductMedia };
