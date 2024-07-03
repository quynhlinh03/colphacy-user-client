import PropTypes from "prop-types";
import { Link } from "react-router-dom";

interface AccountData {
  full_name: string;
  price: string;
  avatar: string;
}

interface AccountItemProps {
  data: AccountData;
}

function AccountItem({ data }: AccountItemProps) {
  return (
    <Link to={`/@${data.price}`} className="wrapper">
      <img className="avatar" src={data.avatar} alt={data.full_name} />
      <div className="info">
        <h4 className="name">
          <span>{data.full_name}</span>
        </h4>
        <span className="username">{data.price}</span>
      </div>
    </Link>
  );
}

AccountItem.propTypes = {
  data: PropTypes.shape({
    full_name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

export default AccountItem;
