import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Spacer,
  Badge,
} from '@chakra-ui/react'
import format from 'date-fns/format'

import { useQuery } from 'react-query'
import ErrorScreen from 'components/ErrorScreen/ErrorScreen'
import { useHistory } from 'react-router'
import { fetchAllAlerts } from 'services/alerts'
import FullScreenLoading from 'components/FullScreenLoading'
import { AlertStatus } from 'types/domain'

const AlertStatusBadge: React.FC<{ status: AlertStatus }> = ({ status }) => {
  let statusText = '',
    colorScheme = ''

  switch (status) {
    case 'confirmed':
      statusText = 'Confirmada - En curso'
      colorScheme = 'red'
      break
    case 'discarded':
      statusText = 'Descartada'
      colorScheme = 'green'
      break
    case 'finalized':
      statusText = 'Finalizada'
      colorScheme = 'green'
      break
    case 'pending_review':
      statusText = 'Pendiente de revisión'
      colorScheme = 'yellow'
      break
  }

  return <Badge colorScheme={colorScheme}>{statusText}</Badge>
}

const Alerts: React.FC<any> = ({ carrier }) => {
  const history = useHistory()

  const { data, isLoading, isError } = useQuery(
    ['fetchAllAlerts'],
    fetchAllAlerts,
  )

  if (isError) {
    return (
      <ErrorScreen message="Hubo un error al intentar cargar las alertas" />
    )
  }

  if (isLoading) {
    return <FullScreenLoading />
  }

  return (
    <Box padding="5">
      <Heading size="lg">Alertas</Heading>
      <Spacer height="10" />
      {data?.length ? (
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Fecha</Th>
              <Th>Cámara</Th>
              <Th>Estado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((a) => (
              <Tr
                cursor="pointer"
                onClick={() => {
                  history.push(`/home/alerts/${a.id}/details`)
                }}
                key={a.id}
              >
                <Td>{a.id}</Td>
                <Td>{format(new Date(a.created_date), 'dd-MM-yyyy HH:mm')}</Td>
                <Td>{a.camera.name}</Td>
                <Td>
                  <AlertStatusBadge status={a.status} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Box height={300}>
          <Heading size="md">No hay alertas registradas</Heading>
        </Box>
      )}
    </Box>
  )
}

export default Alerts
