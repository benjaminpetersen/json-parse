module.exports = {
  transform: {
    "^.+\\.(t|j)s?$": "ts-jest",
  },
  testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  preset: "ts-jest",
};
