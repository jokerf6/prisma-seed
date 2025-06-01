import { faker } from "@faker-js/faker";

export const generateFakeDataFunction = (field) => {
  let convertedField;
  switch (field.type) {
    case "String":
      if (/email/i.test(field.name)) convertedField = faker.internet.email();
      else if (/mail/i.test(field.name))
        convertedField = faker.internet.email();
      else if (/password/i.test(field.name))
        convertedField =
          "$2b$13$sd39AyPEsSz4vXoNZWTL8OeEbKA0jpUJSN4tDtV5xj6Jgmuu2aeC2";
      else if (/phone/i.test(field.name))
        convertedField = `+966 ${generateUniqueSaudiNumbers()}`;
      else if (/image/i.test(field.name))
        convertedField = "https://picsum.photos/400/400";
      else if (/logo/i.test(field.name))
        convertedField = "https://picsum.photos/400/400";
      else if (/banner/i.test(field.name))
        convertedField = "https://picsum.photos/400/400";
      else if (/catalog/i.test(field.name))
        convertedField = "https://picsum.photos/400/400";
      else if (/background/i.test(field.name))
        convertedField = "https://picsum.photos/400/400";
      else if (/name/i.test(field.name))
        convertedField = faker.person.fullName();
      else if (/title/i.test(field.name))
        convertedField = faker.lorem.sentence();
      else if (/hexa/i.test(field.name)) convertedField = "#000000";
      else if (/year/i.test(field.name)) convertedField = "2024";
      else if (/code/i.test(field.name)) convertedField = "1234";
      else if (/token/i.test(field.name)) convertedField = "1234";
      else if (/place/i.test(field.name.toLowerCase()))
        convertedField = faker.location.city();
      else convertedField = faker.lorem.words(3);
      break;
    case "Int":
      if (/age/i.test(field.name))
        convertedField = faker.number.int({ min: 2, max: 20 });
      else if (/weight/i.test(field.name))
        convertedField = faker.number.int({ min: 400, max: 600 });
      else if (/height/i.test(field.name))
        convertedField = faker.number.int({ min: 140, max: 180 });
      else convertedField = faker.number.int({ min: 1, max: 1000 });
      break;
    case "Float":
      if (/age/i.test(field.name))
        convertedField = parseFloat(
          faker.number.float({ min: 2, max: 20, fractionDigits: 1 }).toFixed(1)
        );
      else if (/weight/i.test(field.name))
        convertedField = parseFloat(
          faker.number
            .float({ min: 400, max: 600, fractionDigits: 1 })
            .toFixed(1)
        );
      else if (/height/i.test(field.name))
        convertedField = parseFloat(
          faker.number
            .float({ min: 14.0, max: 18.0, fractionDigits: 1 })
            .toFixed(1)
        );
      else if (/classification|cpi|rate/i.test(field.name))
        convertedField = parseFloat(
          faker.number.float({ min: 0, max: 10, fractionDigits: 2 }).toFixed(2)
        );
      else
        convertedField = parseFloat(
          faker.number
            .float({ min: 0, max: 1000, fractionDigits: 2 })
            .toFixed(2)
        );
      break;
    case "Boolean":
      convertedField = faker.datatype.boolean();
      break;
    case "DateTime":
      if (/birth/i.test(field.name))
        convertedField = faker.date.past({ years: 20 });
      else if (/deletedAt/i.test(field.name)) convertedField = null;
      else convertedField = faker.date.recent();
      break;
  }
  return convertedField;
};
