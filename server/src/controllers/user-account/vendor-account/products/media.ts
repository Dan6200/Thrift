const uploadProductMedia = (req: any, res: any) => {
	console.log(req.file, req.body);
	res.send(req.file);
};

export { uploadProductMedia };
