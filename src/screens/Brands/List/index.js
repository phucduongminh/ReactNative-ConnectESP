import React from 'react'
import t from 'prop-types'

import Ripple from '../../../components/Ripple'

//import Ripple from '../../components/Ripple'

import { Container, Content, Name } from './styled'

const data = [
  { id: 1, name: 'Samsung' },
  { id: 2, name: 'Sony' },
  { id: 3, name: 'Panasonic' }
]

export default function List ({ handleNavigate }) {
  return (
    <Container
      data={data}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => {
        const { name } = item

        return (
          <Ripple
            onPress={handleNavigate}
            radius={0}
            full
          >
            <Content>
              <Name>{name}</Name>
            </Content>
          </Ripple>
        )
      }}
    />
  )
}

List.propTypes = {
  handleNavigate: t.func.isRequired
}