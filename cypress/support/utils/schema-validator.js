import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

// Compilation is Ajv's expensive step — compile each schema once and reuse
const compiledValidators = new Map();

const getValidator = (schema) => {
  if (!compiledValidators.has(schema)) {
    compiledValidators.set(schema, ajv.compile(schema));
  }
  return compiledValidators.get(schema);
};

/**
 * Asserts that `data` conforms to the given JSON Schema, failing the test
 * with every violation listed when it does not.
 */
export const validateSchema = (data, schema) => {
  const validate = getValidator(schema);
  const valid = validate(data);
  const errors = valid ? '' : ajv.errorsText(validate.errors, { separator: '\n' });
  expect(valid, `Response does not match schema:\n${errors}`).to.be.true;
};
