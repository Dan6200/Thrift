import application from './app';
import './pages';

const port = process.env.PORT;

let server: () => Promise<void> = async () => {
	try {
		if (require.main === module)
			application.listen(port, () => {
				console.clear();
				console.log(`Server is listening on port ${port}...`);
			});
	} catch (error) {
		console.log(error, __filename);
	}
};

server();
