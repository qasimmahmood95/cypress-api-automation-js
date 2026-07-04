import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

/**
 * Asserts that `data` conforms to the given JSON Schema, failing the test
 * with every violation listed when it does not.
 */
export const validateSchema = (data, schema) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  const errors = valid ? '' : ajv.errorsText(validate.errors, { separator: '\n' });
  expect(valid, `Response does not match schema:\n${errors}`).to.be.true;
};
