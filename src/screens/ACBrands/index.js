import React from 'react'
import t from 'prop-types'

import Input from './Input'
import List from './List'

import { Container } from './styled'

export default ({ navigation }) => {
  function handleNavigate () {
    navigation.navigate('ACControl')
  }
  return (
    <Container>
      <Input />
      <List handleNavigate={handleNavigate} />
    </Container>
  )
}

propTypes = {
  navigation: t.shape({
    navigate: t.func
  }).isRequired
}