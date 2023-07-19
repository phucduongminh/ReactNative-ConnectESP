import React from 'react'
import t from 'prop-types'

import List from './List'

import { Container } from './styled'

export default ({ navigation }) => {
  function handleNavigate () {
    navigation.navigate('Brands')
  }

  return (
    <Container>
      <List handleNavigate={handleNavigate} />
    </Container>
  )
}

propTypes = {
  navigation: t.shape({
    navigate: t.func
  }).isRequired
}