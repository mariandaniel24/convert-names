const xlsx = require("xlsx");
const fs = require("fs");
const { Parser } = require("json2csv");

function fix_names() {
  const workbook = xlsx.readFile("./input.xlsx", { sheetStubs: false });

  const sheet_name_list = workbook.SheetNames;
  console.log(sheet_name_list);

  const jsonArray = xlsx.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[0]],
    {
      defval: "",
    }
  );

  const formatted = jsonArray.map((person) => {
    const initial = person["First Name"].split(" ");

    const firstName = `${initial[0]}`;

    const [, ...noFirstName] = initial;
    const lastName = initial.length === 1 ? "" : noFirstName.join(" ");

    return { ...person, "First Name": firstName, "Last Name": lastName };
  });

  try {
    const opts = { fields: Object.keys(jsonArray[0]) };
    const parser = new Parser(opts);
    const csv = parser.parse(formatted);

    fs.writeFileSync("output.csv", csv);
  } catch (err) {
    console.error(err);
  }
}
fix_names();
