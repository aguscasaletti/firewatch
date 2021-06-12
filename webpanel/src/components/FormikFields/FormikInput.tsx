/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Input,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
import { Field, FieldProps } from 'formik'
import { BaseFieldProps } from '.'

interface FormikInputProps extends BaseFieldProps {
  placeholder?: string
  iconLeft?: React.ReactChild
  iconRight?: React.ReactChild
}

const FormikInput: React.FC<FormikInputProps> = ({
  label,
  name,
  placeholder = '',
  iconLeft,
  iconRight,
  required = false,
  ...rest
}) => {
  return (
    <div className="field">
      <Text fontWeight={500} marginBottom="1">
        {label} {required && '*'}
      </Text>
      <div>
        <Field name={name} {...rest}>
          {({ field, meta }: FieldProps) => (
            <div>
              <InputGroup>
                {iconLeft && <InputLeftElement>{iconLeft}</InputLeftElement>}
                <Input
                  type="text"
                  placeholder={placeholder}
                  {...rest}
                  {...field}
                  value={field.value || ''}
                />
                {iconRight && (
                  <InputRightElement>{iconRight}</InputRightElement>
                )}
              </InputGroup>
              {meta.touched && meta.error && (
                <Text color="red.500">{meta.error}</Text>
              )}
            </div>
          )}
        </Field>
      </div>
    </div>
  )
}

export default FormikInput
