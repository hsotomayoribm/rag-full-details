import "../App.css"

const Header = ({ logo }) => {
  return (
    <div className='header_container'>
      <a href="/" target="_self">
        <img src={logo} className="logo" alt="Header logo" />
      </a>
      <span className='header_separator'>|</span>
      <span className='header_text'>Buscador Cognitivo</span>
    </div>
  );
}

export default Header;