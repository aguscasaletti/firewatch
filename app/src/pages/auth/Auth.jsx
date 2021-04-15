/* eslint-disable react/display-name */
import React, { useState, memo } from 'react'
import { object, func, bool, oneOf } from 'prop-types'
import { Redirect } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import logo from 'images/fire.png'

import { useAuth } from '../../context/AuthContext'

const useStyles = makeStyles(() => ({
  main: {
    width: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  progressWrapper: {
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    marginTop: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    height: 390,
  },
  form: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  submitWrapper: {
    marginTop: 'auto',
  },
  logo: {
    // filter: 'brightness(0) invert(1)',
    width: 30,
    marginBottom: 12,
    marginLeft: 24,
    marginRight: 12,
  },
  logoWrapper: {
    display: 'flex',
    marginLeft: -24,
  },
  caption: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  submit: {
    textTransform: 'none',
    fontWeight: 100,
    fontSize: 16,
  },
}))

const AuthPage = () => {
  const { user: authUser, finishedAuthCheck, login } = useAuth()
  const classes = useStyles()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const onInputChange = (field) => (evt) =>
    setForm({
      ...form,
      [field]: evt.target.value,
    })

  const onSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = form
    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 2000))
      login(email, password)
      window.location.href = `${window.location.origin}/home`
    } catch (error) {
      console.error(error)
    }

    return false
  }

  if (!finishedAuthCheck) {
    return (
      <div className={classes.progressWrapper}>
        <CircularProgress color="secondary" />
      </div>
    )
  }

  return authUser ? (
    <Redirect to="/home" />
  ) : (
    <div className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <div className={classes.logoWrapper}>
          <img src={logo} alt="firewatch" className={classes.logo} />
          <Typography variant="h5">Firewatch</Typography>
        </div>
        <Typography className={classes.caption} variant="body1">
          Ingresá con tu email y contraseña para empezar a monitorear tus
          cámaras inteligentes.
        </Typography>
        <br />
        {loading ? (
          <div className={classes.progressWrapper}>
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <>
            <form className={classes.form} onSubmit={onSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel color="secondary" htmlFor="email">
                  Dirección de email
                </InputLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  onChange={onInputChange('email')}
                  autoFocus
                  color="secondary"
                  value={form.email}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel color="secondary" htmlFor="password">
                  Password
                </InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  color="secondary"
                  autoComplete="current-password"
                  onChange={onInputChange('password')}
                  value={form.password}
                />
              </FormControl>

              <div className={classes.submitWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </form>
            <br />
          </>
        )}
      </Paper>
    </div>
  )
}

AuthPage.propTypes = {
  setUser: func.isRequired,
  user: object,
  finishedAuthCheck: bool.isRequired,
  match: object.isRequired,
  mode: oneOf(['medico', 'paciente']).isRequired,
}

AuthPage.defaultProps = {
  user: null,
}

export default memo(AuthPage)
