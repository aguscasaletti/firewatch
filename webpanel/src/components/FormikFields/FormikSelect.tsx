/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Text, Select, Box } from '@chakra-ui/react'
import { Field, FieldProps } from 'formik'
import { BaseFieldProps } from '.'

export interface SelectItem {
  label: string
  value: string
}

interface FormikSelectProps extends BaseFieldProps {
  placeholder?: string
  options: SelectItem[]
}

const FormikSelect: React.FC<FormikSelectProps> = ({
  label,
  name,
  placeholder = '',
  required = false,
  options,
  ...rest
}) => {
  return (
    <Box>
      <Text fontWeight={500} marginBottom="1">
        {label} {required && '*'}
      </Text>
      <Box>
        <Field name={name} {...rest}>
          {({ meta, form }: FieldProps) => (
            <Box>
              <Select
                onChange={(e) => form.setFieldValue(name, e.target.value)}
                value={meta.value}
                name="name"
                placeholder={placeholder}
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {meta.touched && meta.error && (
                <Text color="red.500">{meta.error}</Text>
              )}
            </Box>
          )}
        </Field>
      </Box>
    </Box>
  )
}

export default FormikSelect
