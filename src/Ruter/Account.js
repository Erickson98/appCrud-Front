export const Account = async () => {
  const element = await fetch(
    'https://appintern78.herokuapp.com/auth/login/success',
    {
      credentials: 'include',
    },
  )
    .then((response) => {
      if (response.status === 200) return response.json()
      throw new Error('authentication has been failed!')
    })
    .then((resObject) => {
      return resObject
    })
    .catch((err) => {
      console.log(err)
    })
  return element
}

export const confirmedRefreshToken = async () => {
  return await fetch(
    'https://appintern78.herokuapp.com/auth/checkAutherization',
    {
      credentials: 'include',
    },
  )
    .then((response) => {
      if (response.status === 200) return response.json()
      throw new Error('authentication has been failed!')
    })
    .then((resObject) => {
      return resObject
    })
    .catch((err) => {
      console.log(err)
    })
}

export const confirmedCredentials = async () => {
  return await fetch(
    'https://appintern78.herokuapp.com/auth/checkCredentials',
    {
      credentials: 'include',
    },
  )
    .then((response) => {
      if (response.status === 200) return response.json()
      throw new Error('authentication has been failed!')
    })
    .then((resObject) => {
      return resObject
    })
    .catch((err) => {
      console.log(err)
    })
}

export const confirmedAdmin = async () => {
  return await fetch('https://appintern78.herokuapp.com/auth/checkAdmin', {
    credentials: 'include',
  })
    .then((response) => {
      if (response.status === 200) return response.json()
      throw new Error('authentication has been failed!')
    })
    .then((resObject) => {
      return resObject
    })
    .catch((err) => {
      console.log(err)
    })
}
export const deleteCookies = async () => {
  return await fetch('https://appintern78.herokuapp.com/auth/deleteCookies', {
    credentials: 'include',
  })
    .then((response) => {
      if (response.status === 200) return response.json()
      throw new Error('authentication has been failed!')
    })
    .then((resObject) => {
      return resObject
    })
    .catch((err) => {
      console.log(err)
    })
}
