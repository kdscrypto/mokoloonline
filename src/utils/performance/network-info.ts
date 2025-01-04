export const getConnectionInfo = () => {
  const connection = (navigator as any).connection;
  if (!connection) return {};
  
  return {
    connectionType: connection.type,
    effectiveType: connection.effectiveType
  };
};