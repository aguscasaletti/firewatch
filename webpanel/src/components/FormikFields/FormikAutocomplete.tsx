/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Text, Box } from '@chakra-ui/react'
import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import { Field, FieldProps } from 'formik'
import { BaseFieldProps } from '.'

export interface AutocompleteItem {
  label: string
  value: string
}

export interface FormikAutocompleteProps extends BaseFieldProps {
  placeholder?: string
  options: AutocompleteItem[]
  optionFilterFunc?: (
    items: AutocompleteItem[],
    inputValue: string,
  ) => AutocompleteItem[]
}

const FormikAutocomplete: React.FC<FormikAutocompleteProps> = ({
  label,
  name,
  placeholder = '',
  options,
  required = false,
  optionFilterFunc,
  ...rest
}) => {
  return (
    <Box>
      <Field name={name} {...rest}>
        {({ field, meta, form }: FieldProps) => {
          return (
            <Box>
              <CUIAutoComplete
                label={label}
                placeholder={placeholder}
                items={options}
                selectedItems={field.value ? [field.value] : []}
                onSelectedItemsChange={(changes) => {
                  if (changes.selectedItems) {
                    form.setFieldValue(field.name, changes.selectedItems[0])
                  }
                }}
                disableCreateItem
                optionFilterFunc={optionFilterFunc}
                hideToggleButton
                listStyleProps={{
                  position: 'absolute',
                  width: '90%',
                  zIndex: 99,
                }}
              />
              {meta.touched && meta.error && (
                <Text color="red.500">{meta.error}</Text>
              )}
            </Box>
          )
        }}
      </Field>
    </Box>
  )
}

export default FormikAutocomplete
