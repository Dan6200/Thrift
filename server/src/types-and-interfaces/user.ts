interface UserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: Buffer | String;
  dob?: Date;
  country?: string;
}

export { UserData };
