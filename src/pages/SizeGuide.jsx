import { Link } from 'react-router-dom';
import { Ruler } from 'lucide-react';
import './PolicyPages.css';

const SizeGuide = () => {
  const mensChart = [
    { size: 'S',   chest: '36–38"', waist: '30–32"', length: '27"', weight: '55–65 kg' },
    { size: 'M',   chest: '38–40"', waist: '32–34"', length: '28"', weight: '65–75 kg' },
    { size: 'L',   chest: '40–42"', waist: '34–36"', length: '29"', weight: '75–85 kg' },
    { size: 'XL',  chest: '42–44"', waist: '36–38"', length: '30"', weight: '85–95 kg' },
    { size: 'XXL', chest: '44–46"', waist: '38–40"', length: '31"', weight: '95–110 kg' },
  ];

  const womensChart = [
    { size: 'S',   chest: '34–36"', waist: '26–28"', length: '25"', weight: '45–55 kg' },
    { size: 'M',   chest: '36–38"', waist: '28–30"', length: '26"', weight: '55–65 kg' },
    { size: 'L',   chest: '38–40"', waist: '30–32"', length: '27"', weight: '65–75 kg' },
    { size: 'XL',  chest: '40–42"', waist: '32–34"', length: '28"', weight: '75–85 kg' },
  ];

  return (
    <div className="policy-page section container">
      <div className="policy-breadcrumb">
        <Link to="/">Home</Link> / <span>Size Guide</span>
      </div>

      <div className="policy-hero">
        <Ruler size={40} />
        <h1>Size Guide</h1>
        <p>Find your perfect fit with our detailed size charts.</p>
      </div>

      {/* How to Measure */}
      <div className="policy-card measure-card">
        <h2>How to Measure</h2>
        <div className="measure-grid">
          <div className="measure-item">
            <span className="measure-icon">📏</span>
            <h4>Chest</h4>
            <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
          </div>
          <div className="measure-item">
            <span className="measure-icon">📐</span>
            <h4>Waist</h4>
            <p>Measure around your natural waistline, keeping the tape comfortably loose.</p>
          </div>
          <div className="measure-item">
            <span className="measure-icon">📋</span>
            <h4>Length</h4>
            <p>Measure from the highest point of the shoulder down to the desired length.</p>
          </div>
        </div>
      </div>

      {/* Men's Chart */}
      <div className="policy-card">
        <h2>Men's / Unisex Size Chart</h2>
        <div className="size-table-wrapper">
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Length</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {mensChart.map(row => (
                <tr key={row.size}>
                  <td><span className="size-badge">{row.size}</span></td>
                  <td>{row.chest}</td>
                  <td>{row.waist}</td>
                  <td>{row.length}</td>
                  <td>{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Women's Chart */}
      <div className="policy-card">
        <h2>Women's Size Chart</h2>
        <div className="size-table-wrapper">
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest</th>
                <th>Waist</th>
                <th>Length</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {womensChart.map(row => (
                <tr key={row.size}>
                  <td><span className="size-badge">{row.size}</span></td>
                  <td>{row.chest}</td>
                  <td>{row.waist}</td>
                  <td>{row.length}</td>
                  <td>{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="policy-tip">
        <strong>Tip:</strong> If you're between sizes, we recommend sizing up for a more relaxed fit or sizing down for a fitted look.
      </div>

      <div className="policy-contact-banner">
        <p>Not sure about your size? <Link to="/contact">Ask us →</Link></p>
      </div>
    </div>
  );
};

export default SizeGuide;
