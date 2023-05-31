const shippingInformationList = [
  {
    recipient_first_name: "John",
    recipient_last_name: "Mayer",
    street: "25 Avenue",
    city: "Abuja",
    state: "FCT",
    postal_code: "135234",
    delivery_contact: "23481760595",
    delivery_instructions: "Call before you arrive!",
  },
  {
    recipient_first_name: "Mary",
    recipient_last_name: "Anderson",
    street: "24 Ogbafemi Awolowo",
    city: "Port Harcourt",
    state: "Rivers",
    postal_code: "602935",
    delivery_contact: "23463957295",
    delivery_instructions: "Leave item with my security guard",
  },
  {
    recipient_first_name: "John",
    recipient_last_name: "Doe",
    street: "24 Street",
    city: "Lagos",
    state: "Lagos",
    postal_code: "123435",
    delivery_contact: "23460581795",
    delivery_instructions: "Call me before you arrive!",
  },
];

const updatedShippingInformationList = [
  {
    recipient_first_name: "Mary",
    street: "24 Ogbafemi Awolowo",
    postal_code: "602935",
    delivery_contact: "23463957295",
    delivery_instructions: "Leave item with my security guard",
  },
  {
    recipient_first_name: "John",
    recipient_last_name: "Doe",
    street: "Plot 24 Ogun silas",
    delivery_contact: "23460581795",
    delivery_instructions: "Call me before you arrive!",
  },
  {
    recipient_last_name: "Mayer",
    street: "25 Avenue",
    postal_code: "135234",
    delivery_contact: "23481760595",
    delivery_instructions: "Call before you arrive!",
  },
];

export { shippingInformationList, updatedShippingInformationList };
