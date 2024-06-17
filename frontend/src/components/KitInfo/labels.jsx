import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InputIcon from '@mui/icons-material/Input';
import OutboundIcon from '@mui/icons-material/Outbound';

export const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};
export const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
export const typeToIcon = {
  CREATION: <AddIcon />,
  RETIREMENT: <DeleteForeverIcon />,
  RESTOCK: <InputIcon />,
  LOAN: <OutboundIcon />,
};

export const typeToDotColor = {
  CREATION: 'success',
  RETIREMENT: 'error',
  RESTOCK: 'info',
  LOAN: 'warning',
};

export const typeToColor = {
  CREATION: 'success.main',
  RETIREMENT: 'error.main',
  RESTOCK: 'info.main',
  LOAN: 'warning.main',
};

export const typeToInfo = (history) => {
  switch (history.type) {
    case 'CREATION':
      return `Created by ${history.person.username}`;
    case 'RETIREMENT':
      return `Retired by ${history.person.username}`;
    case 'RESTOCK':
      return `Restocked by ${history.person.username}`;
    case 'LOAN':
      return `Loaned to ${history.loan_info.loanee_name} by ${history.person.username}`;
    default:
      return '';
  }
};

export const columns = (isMobile) => [
  { field: 'name', headerName: 'Item', width: isMobile ? 120 : 200 },
  {
    field: 'quantity',
    headerName: 'Qty',
    width: 70,
  },
  { field: 'expiry', headerName: 'Expiry', width: isMobile ? 120 : 200 },
];

export const typeToModalInfo = (history) => {
  switch (history.type) {
    case 'CREATION':
      return (
        <span>
          {`On ${new Date(history.date).toLocaleString(
            'en-US',
            options,
          )}, kit was created by ${
            history.person.username
          }, and created withdraw order ${history.order_id}. Click `}
          <a
            href={`/inventory/items/receipt?orderId=${history.order_id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            here
          </a>
          {` to view the order.`}
        </span>
      );
    case 'RETIREMENT':
      return (
        <span>
          {`On ${new Date(history.date).toLocaleString(
            'en-US',
            options,
          )}, kit was retired by ${
            history.person.username
          }, and created deposit order ${history.order_id}. Click `}
          <a
            href={`/inventory/items/receipt?orderId=${history.order_id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            here
          </a>
          {` to view the order.`}
        </span>
      );
    case 'RESTOCK':
      return (
        <span>
          {`On ${new Date(history.date).toLocaleString(
            'en-US',
            options,
          )}, kit was restocked by ${
            history.person.username
          }, and created deposit order ${history.order_id}. Click `}
          <a
            href={`/inventory/items/receipt?orderId=${history.order_id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            here
          </a>
          {` to view the order.`}
        </span>
      );
    case 'LOAN':
      return (
        <span>
          {`On ${new Date(history.date).toLocaleString(
            'en-US',
            options,
          )}, kit was loaned to ${history.loan_info.loanee_name} by ${
            history.person.username
          }.`}
          {history.loan_info.return_date
            ? `The kit was returned on ${new Date(
                history.loan_info.return_date,
              ).toLocaleString(
                'en-US',
                options,
              )}. The below snapshot is the state of the kit when it was returned.`
            : ` The kit has not been returned, and is due on ${new Date(
                history.loan_info.due_date,
              ).toLocaleString(
                'en-US',
                dateOptions,
              )}. The below snapshot is the state of the kit when it is loaned out.`}
        </span>
      );
    default:
      return '';
  }
};
