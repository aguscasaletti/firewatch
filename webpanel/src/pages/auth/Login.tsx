import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, Text, Flex, Container, Center } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import { LockIcon, CheckIcon } from '@chakra-ui/icons'
import { AiFillFire } from 'react-icons/ai'

import FormikInput from 'components/FormikFields/FormikInput'

const schema = Yup.object().shape({
  username: Yup.string().required('Este campo es requerido'),
  password: Yup.string()
    .required('Este campo es requerido')
    .max(30, 'El máximo de caracteres para este campo es 30'),
})

const initialValues = {
  username: '',
  password: '',
}

const Login: React.FC = () => {
  const history = useHistory()

  return (
    <Flex backgroundColor="#1d2d3f" height="100%" alignItems="center">
      <Container
        verticalAlign="middle"
        borderRadius="md"
        padding="16px"
        maxWidth={400}
        backgroundColor="#253649"
      >
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await new Promise((res) => setTimeout(res, 2000))
            history.push('/home')
          }}
        >
          {({ isSubmitting, isValid }) => {
            return (
              <Form action="" className="box" autoComplete="on">
                <Flex flex="1" justifyContent="center">
                  <AiFillFire size="25" color="white" display="inline-block" />
                  <Text ml="1" mb="3" fontSize="lg">
                    Firewatch
                  </Text>
                </Flex>
                <FormikInput
                  name="username"
                  label="Usuario"
                  placeholder="Escribí tu usuario"
                  iconLeft={<CheckIcon />}
                />
                <div style={{ height: 12 }} />
                <FormikInput
                  name="password"
                  label="Password"
                  placeholder="Escribí tu contraseña"
                  iconLeft={<LockIcon />}
                  type="password"
                />

                <Center marginTop="3">
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                  >
                    Iniciar sesión
                  </Button>
                </Center>
              </Form>
            )
          }}
        </Formik>
      </Container>
    </Flex>
  )
}

export default Login
