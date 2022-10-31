// TODO: make a reusable async list
export default interface AsyncList<Type> {
	_user: Type[];
	add(token: Type): Promise<void>;
	clear(): Promise<void>;
	getList(): Promise<Type[]>;
}

const productIds: AsyncList<string> = {
	_user: [],
	async add(data) {
		await this._user.push(data);
	},
	async clear() {
		this._user = [];
	},
	async getList() {
		return await this._user;
	},
};
