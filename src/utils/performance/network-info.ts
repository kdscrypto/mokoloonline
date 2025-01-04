export const getConnectionInfo = () => {
  const connection = (navigator as any).connection;
  if (!connection) return {
    connectionType: undefined,
    effectiveType: undefined
  };
  
  return {
    connectionType: connection.type,
    effectiveType: connection.effectiveType
  };
};