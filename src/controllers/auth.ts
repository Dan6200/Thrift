import db from "../db";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";
import path from "path";
// import validatePhoneNumber from '../security/validate-phone';
// import validateEmail from '../security/validate-email';
import { hashPassword, validatePassword } from "../security/password";
import { createToken } from "../security/create-token";
// import locateIP from '../security/ipgeolocator';
const fileName = path.basename(__filename);

const register = async (request, response) => {
  const userData = request.body,
    {
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      password,
    } = userData;

  if (!phone && !email) {
    throw new BadRequestError(
      `please provide an email address or phone number`
    );
  }
  if (!password) {
    throw new BadRequestError(`please provide a password`);
  }
  let contact = "";
  if (email) {
    // TODO: const validEmail = validateEmail(email)
    const validEmail = true;
    if (!validEmail)
      throw new BadRequestError(`
				please provide a valid email address
			`);
    // TODO: Email verification
    contact += "email,\n";
  }
  if (phone) {
    // TODO: const validPhoneNumber = validatePhoneNumber(phone)
    const validPhoneNumber = true;
    if (!validPhoneNumber)
      throw new BadRequestError(`
				please provide a valid phone number
			`);
    // TODO: SMS verification
    contact += "phone,\n";
  }
  userData.password = await hashPassword(password);
  userData.initials = firstName.charAt(0) + lastName.charAt(0);
  await db.query(
    `
		insert into  marketplace.user_account (
			first_name,
			last_name,
			${contact} password,
			ip_address,
			country,
			dob,
			is_vendor,
			is_customer,
			initials
		) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    Object.values(userData)
  );
  let result = await db.query(`
		select user_id, phone, email 
		from marketplace.user_account`),
    lastInsert = result.rowCount - 1,
    newUser = result.rows[lastInsert],
    token = createToken(newUser.user_id, newUser.phone, newUser.email);
  response.status(StatusCodes.CREATED).json({
    newUser,
    token,
  });
};

const login = async (request, response) => {
  const { email, phone, password } = request.body;
  if (!email && !phone) {
    throw new BadRequestError("Please provide email or phone number!");
  }
  if (!password) throw new BadRequestError("Please provide password");
  let user;
  if (email) {
    user = (
      await db.query(
        `
			select user_id, password
			from marketplace.user_account 
			where email=$1`,
        [email]
      )
    ).rows[0];
  } else {
    user = (
      await db.query(
        `
			select user_id, password
			from marketplace.user_account 
			where phone=$1`,
        [phone]
      )
    ).rows[0];
  }
  if (!user) throw new UnauthenticatedError("Invalid Credentials");
  const pwdIsValid = await validatePassword(password, user.password.toString());
  if (!pwdIsValid) throw new UnauthenticatedError("Invalid Credentials");

  // TODO: confirm user if there is a different IP Address
  // TODO: create separate IP Address tables as users may login
  // ...different IP Addresses

  const token = createToken(user);
  const { user_id: userId } = user;
  response.status(StatusCodes.OK).json({
    userId,
    token,
  });
};

export { register, login };
