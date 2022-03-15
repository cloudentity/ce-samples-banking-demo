import { Navigate } from 'react-router-dom';

const Unauthorized = ({className, auth, handleLogin}) => {
  return (
    <div className={className}>
      {auth === null && <div>Loading...</div>}
      {auth === false && (
        <div>
          <h1>You are not authorized.</h1>
          <button onClick={handleLogin}>
            Please log in using your preferred Identity Provider.
          </button>
        </div>
      )}
      {auth && <Navigate to='/authorized' />}
    </div>
  );
};

export default Unauthorized;
