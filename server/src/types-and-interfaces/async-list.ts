// TODO: make a reusable async list
export default interface AsyncList<Type> {
	_user: Type[];
	add(token: Type): Promise<void>;
	clear(): Promise<void>;
	getList(): Promise<Type[]>;
}
