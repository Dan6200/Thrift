import app from './app';

const port = process.env.PORT;

let server: () => void = () => {
	try {
		if (require.main === module)
			app.listen(port, () => {
				console.clear();
				console.log(`Server is listening on port ${port}...`);
			});
	} catch (error) {
		console.error(error);
	}
};

server();
