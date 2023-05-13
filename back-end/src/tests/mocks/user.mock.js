const userMock = {
  name: "Cliente Zé Birita",
  email: "zebirita@email.com",
  role: "customer",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjcwMzYzOTkxfQ.OCrTfd9n9E149u5s8AOfhpBFL_0j6zZjJ0rI_gda0ro",
};

const userBody = {
  email: "zebirita@email.com",
  password: "$#zebirita#$",
};

const newUserMock = {
  name: "Isabella a Moraes",
  email: "isabellyamoraes_reis@live.com",
  role: "customer",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjozMzk3MDMyMDAwfQ.OCrTfd9n9E149u5s8AOfhpBFL_0j6zZjJ0rI_gda0ro",
};

const newUserBody = {
  name: "Isabella a Moraes",
  email: "isabellyamoraes_reis@live.com",
  password: "LhnFkT", // '797662aa1930d23ddc19e15a173e8add' (md5)
};


const usersList = [
  {
    id: 1,
    name: "Delivery App Admin",
    email: "adm@deliveryapp.com",
    role: "administrator",
  },
  {
    id: 2,
    name: "Fulana Pereira",
    email: "fulana@deliveryapp.com",
    role: "seller",
  },
  {
    id: 3,
    name: "Cliente Zé Birita",
    email: "zebirita@email.com",
    role: "customer",
  },
];

const sellersList = [{ id: 2, name: "Fulana Pereira" }];

module.exports = {
  userBody,
  newUserBody,
  userMock,
  newUserMock,
  usersList,
  sellersList,
};
