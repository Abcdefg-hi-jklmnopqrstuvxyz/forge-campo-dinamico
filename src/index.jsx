import {
  CustomField,
  Option,
  Select,
  Text,
  useAsync,
  useProductContext,
  useState
} from '@forge/ui';
import api, { route } from '@forge/api';

const CLIENT_FIELD_KEY = process.env.CLIENT_FIELD_KEY || 'customfield_cliente';

const clientDirectory = {
  'Municipalidad de salta': {
    users: [
      { accountId: 'user-account-id-1', displayName: 'Agente Municipal 1' },
      { accountId: 'user-account-id-2', displayName: 'Agente Municipal 2' }
    ],
    departments: ['Atención Ciudadana', 'Infraestructura', 'Sistemas']
  },
  Default: {
    users: [
      { accountId: 'default-account-id', displayName: 'Equipo General' }
    ],
    departments: ['Soporte General']
  }
};

const fetchIssueCliente = async (issueKey) => {
  if (!issueKey) {
    return null;
  }

  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}?fields=${CLIENT_FIELD_KEY}`);
  const data = await response.json();
  return data?.fields?.[CLIENT_FIELD_KEY] || null;
};

const resolveDirectoryByClient = (cliente) => {
  if (!cliente) {
    return clientDirectory.Default;
  }

  const normalized = String(cliente).toLowerCase();
  const match = Object.entries(clientDirectory).find(([name]) => name.toLowerCase() === normalized);
  return match ? match[1] : clientDirectory.Default;
};

const buildUserOptions = (cliente) => {
  const directory = resolveDirectoryByClient(cliente);
  return directory.users.map((user) => ({ label: user.displayName, value: user.accountId }));
};

const buildDepartmentOptions = (cliente) => {
  const directory = resolveDirectoryByClient(cliente);
  return directory.departments.map((dept) => ({ label: dept, value: dept }));
};

const EditResolvedBy = () => {
  const context = useProductContext();
  const issueKey = context.platformContext?.issueKey;
  const [cliente] = useAsync(() => fetchIssueCliente(issueKey), [issueKey]);
  const [value, setValue] = useState(context.extensionContext?.fieldValue || '');
  const options = buildUserOptions(cliente);

  return (
    <CustomField>
      <Select label="Resuelto por" value={value} onChange={setValue} isRequired>
        {options.map((option) => (
          <Option key={option.value} label={option.label} value={option.value} />
        ))}
      </Select>
      {!cliente && <Text>Aún no se pudo obtener el cliente. Verifica que el campo Cliente esté presente.</Text>}
    </CustomField>
  );
};

const ViewResolvedBy = () => {
  const context = useProductContext();
  const value = context.extensionContext?.fieldValue;

  if (!value) {
    return <Text>Sin asignar</Text>;
  }

  const directory = Object.values(clientDirectory).find((dir) => dir.users.some((user) => user.accountId === value));
  const userName = directory?.users.find((user) => user.accountId === value)?.displayName || value;

  return (
    <CustomField>
      <Text>{userName}</Text>
    </CustomField>
  );
};

const EditResolvedDept = () => {
  const context = useProductContext();
  const issueKey = context.platformContext?.issueKey;
  const [cliente] = useAsync(() => fetchIssueCliente(issueKey), [issueKey]);
  const [value, setValue] = useState(context.extensionContext?.fieldValue || '');
  const options = buildDepartmentOptions(cliente);

  return (
    <CustomField>
      <Select label="Departamento que resuelve" value={value} onChange={setValue} isRequired>
        {options.map((option) => (
          <Option key={option.value} label={option.label} value={option.value} />
        ))}
      </Select>
      {!cliente && <Text>El valor de Cliente no está disponible. Selecciona una opción genérica.</Text>}
    </CustomField>
  );
};

const ViewResolvedDept = () => {
  const context = useProductContext();
  const value = context.extensionContext?.fieldValue;

  return (
    <CustomField>
      <Text>{value || 'Sin asignar'}</Text>
    </CustomField>
  );
};

export const editResueltoPor = EditResolvedBy;
export const viewResueltoPor = ViewResolvedBy;
export const editDptoResueltoPor = EditResolvedDept;
export const viewDptoResueltoPor = ViewResolvedDept;
