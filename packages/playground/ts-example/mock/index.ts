import { faker } from "@faker-js/faker";
import Mock from "mockjs";
import { defineFakeRoute } from "vite-plugin-fake-server/client";

const adminUserTemplate = {
	id: "@guid",
	username: "@first",
	email: "@email",
	avatar: '@image("200x200")',
	role: "admin",
};

const adminUserInfo = Mock.mock(adminUserTemplate);

export default defineFakeRoute([
	{
		url: "/mock/get-user-info",
		response: () => {
			return adminUserInfo;
		},
	},
	{
		url: "/fake/get-user-info",
		response: () => {
			return {
				id: faker.string.uuid(),
				avatar: faker.image.avatar(),
				birthday: faker.date.birthdate(),
				email: faker.internet.email(),
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				sex: faker.person.sexType(),
				role: "admin",
			};
		},
	},
	{
		url: "/mock/with-credentials",
		method: "POST",
		headers: {
			"access-control-allow-credentials": "true",
			"access-control-allow-origin": "https://developer.mozilla.org/",
		},
		response: () => {
			return { message: "with-credentials" };
		},
	},
]);
