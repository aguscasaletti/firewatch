/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button } from '@chakra-ui/button'
import { ChevronUpIcon } from '@chakra-ui/icons'
import { Flex, Heading, List, ListIcon, Spacer, Text } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ComponentWithAs } from '@chakra-ui/system'

import { Route, UserInfo } from 'types/domain'
import { IoDocumentTextOutline, IoPersonOutline } from 'react-icons/io5'
import { FiTruck } from 'react-icons/fi'
import { GiHealthNormal } from 'react-icons/gi'

interface SideNavItem {
  label: string
  icon: ComponentWithAs<'svg'>
}

const sideNavItems: Record<string, SideNavItem> = {
  '/home/cameras': {
    label: 'Cámaras',
    icon: GiHealthNormal,
  },
  '/home/stations': {
    label: 'Cuarteles',
    icon: GiHealthNormal,
  },
  '/home/alerts': {
    label: 'Alertas',
    icon: GiHealthNormal,
  },
  '/home/users': {
    label: 'Usuarios',
    icon: GiHealthNormal,
  },
}

interface SideNavProps {
  authorizedRoutes: Route[]
  userInfo: UserInfo
  logout: () => void
}

const SideNav: React.FunctionComponent<SideNavProps> = ({
  authorizedRoutes = [],
  userInfo,
  logout,
}) => {
  const [isMenuOpen] = useState(false)

  return (
    <Flex
      width={280}
      height="100%"
      padding="5"
      flexDirection="column"
      backgroundColor="blue.800"
    >
      <Heading color="white" size="md" marginBottom="8">
        Firewatch
      </Heading>

      {authorizedRoutes.map((section, idx) => {
        return (
          <React.Fragment key={idx}>
            <Text marginTop="3" marginBottom="1" color="gray.400">
              {section.label}
            </Text>
            <List spacing="1">
              {section.routes
                .filter((r) => Boolean(sideNavItems[r]))
                .map((r, idx) => {
                  const icon = sideNavItems[r].icon
                  return (
                    <Link
                      style={{ marginTop: 2 }}
                      key={idx}
                      to={{ pathname: r }}
                    >
                      <Text
                        color="white"
                        paddingTop="2"
                        paddingBottom="2"
                        paddingLeft="2"
                        borderRadius="md"
                        backgroundColor={
                          window.location.pathname === r
                            ? 'blue.900'
                            : undefined
                        }
                      >
                        <ListIcon as={icon} color="white" />
                        {sideNavItems[r].label}
                      </Text>
                    </Link>
                  )
                })}
            </List>
          </React.Fragment>
        )
      })}
      <Spacer />
      <Menu>
        <MenuButton
          isActive={isMenuOpen}
          as={Button}
          rightIcon={<ChevronUpIcon />}
        >
          {userInfo.name || userInfo.username}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default SideNav
