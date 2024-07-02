export const getUserQueryString = `
SELECT ua.first_name, ua.last_name, ua.email, ua.phone, ua.country, ua.dob
			 CASE WHEN c.customer_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_customer,
			 CASE WHEN v.vendor_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_vendor
FROM user_accounts ua
LEFT JOIN customers c
ON ua.uid = c.customer_id
LEFT JOIN vendors v
ON ua.uid = v.vendor_id
WHERE ua.uid = $1`
