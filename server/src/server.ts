import application from 'application';
import 'pages';

const port = process.env.PORT;

let server: () => Promise<void> = async () => {
	try {
		if (require.main === module)
			application.listen(port, () => {
				console.clear();
				console.log(`Server is listening on port ${port}...`);
			});
	} catch (error) {
		console.error(error);
	}
};

server();
