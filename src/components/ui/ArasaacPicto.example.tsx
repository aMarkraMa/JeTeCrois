/**
 * ArasaacPicto Component - Usage Examples
 * 
 * This file demonstrates various ways to use the ArasaacPicto component
 */

import { ArasaacPicto } from './ArasaacPicto';

export function ArasaacPictoExamples() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>ARASAAC Pictogram Component Examples</h1>

      {/* Basic Usage */}
      <section style={{ marginBottom: '40px' }}>
        <h2>1. Basic Usage (Default Settings)</h2>
        <p>Only ID is required, all other parameters use defaults</p>
        <ArasaacPicto id={20401} />
        <pre>{`<ArasaacPicto id={20401} />`}</pre>
      </section>

      {/* Custom Size */}
      <section style={{ marginBottom: '40px' }}>
        <h2>2. Custom Size</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <p>50%</p>
            <ArasaacPicto id={20401} size="50%" />
          </div>
          <div>
            <p>100px</p>
            <ArasaacPicto id={20401} size="100px" />
          </div>
          <div>
            <p>150px</p>
            <ArasaacPicto id={20401} size="150px" />
          </div>
        </div>
        <pre>{`<ArasaacPicto id={20401} size="50%" />
<ArasaacPicto id={20401} size="100px" />
<ArasaacPicto id={20401} size="150px" />`}</pre>
      </section>

      {/* Background Color */}
      <section style={{ marginBottom: '40px' }}>
        <h2>3. Background Color</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>No background (default)</p>
            <ArasaacPicto id={20401} size="100px" backgroundColor="none" />
          </div>
          <div>
            <p>White background</p>
            <ArasaacPicto id={20401} size="100px" backgroundColor="white" />
          </div>
          <div>
            <p>Yellow background</p>
            <ArasaacPicto id={20401} size="100px" backgroundColor="yellow" />
          </div>
          <div>
            <p>Blue background</p>
            <ArasaacPicto id={20401} size="100px" backgroundColor="#e3f2fd" />
          </div>
        </div>
        <pre>{`<ArasaacPicto id={20401} size="100px" backgroundColor="none" />
<ArasaacPicto id={20401} size="100px" backgroundColor="white" />
<ArasaacPicto id={20401} size="100px" backgroundColor="yellow" />
<ArasaacPicto id={20401} size="100px" backgroundColor="#e3f2fd" />`}</pre>
      </section>

      {/* Strikethrough */}
      <section style={{ marginBottom: '40px' }}>
        <h2>4. Strikethrough (Negation)</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>Normal</p>
            <ArasaacPicto id={20401} size="100px" />
          </div>
          <div>
            <p>With strikethrough</p>
            <ArasaacPicto id={20401} size="100px" strikethrough={true} />
          </div>
        </div>
        <pre>{`<ArasaacPicto id={20401} size="100px" />
<ArasaacPicto id={20401} size="100px" strikethrough={true} />`}</pre>
      </section>

      {/* Hair and Skin Color */}
      <section style={{ marginBottom: '40px' }}>
        <h2>5. Hair and Skin Color Customization</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>Default colors</p>
            <ArasaacPicto id={2950} size="100px" />
          </div>
          <div>
            <p>Blonde hair</p>
            <ArasaacPicto id={2950} size="100px" hairColor="#f4d03f" />
          </div>
          <div>
            <p>Brown hair</p>
            <ArasaacPicto id={2950} size="100px" hairColor="#8B4513" />
          </div>
          <div>
            <p>Different skin tone</p>
            <ArasaacPicto id={2950} size="100px" skinColor="#8d5524" />
          </div>
        </div>
        <pre>{`<ArasaacPicto id={2950} size="100px" />
<ArasaacPicto id={2950} size="100px" hairColor="#f4d03f" />
<ArasaacPicto id={2950} size="100px" hairColor="#8B4513" />
<ArasaacPicto id={2950} size="100px" skinColor="#8d5524" />`}</pre>
      </section>

      {/* Plural */}
      <section style={{ marginBottom: '40px' }}>
        <h2>6. Plural Version</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>Singular</p>
            <ArasaacPicto id={2950} size="100px" />
          </div>
          <div>
            <p>Plural</p>
            <ArasaacPicto id={2950} size="100px" plural={true} />
          </div>
        </div>
        <pre>{`<ArasaacPicto id={2950} size="100px" />
<ArasaacPicto id={2950} size="100px" plural={true} />`}</pre>
      </section>

      {/* Black and White */}
      <section style={{ marginBottom: '40px' }}>
        <h2>7. Black and White Version</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p>Color (default)</p>
            <ArasaacPicto id={20401} size="100px" />
          </div>
          <div>
            <p>Black and white</p>
            <ArasaacPicto id={20401} size="100px" color={false} />
          </div>
        </div>
        <pre>{`<ArasaacPicto id={20401} size="100px" />
<ArasaacPicto id={20401} size="100px" color={false} />`}</pre>
      </section>

      {/* Clickable */}
      <section style={{ marginBottom: '40px' }}>
        <h2>8. Clickable Pictogram</h2>
        <ArasaacPicto 
          id={20401} 
          size="100px" 
          onClick={() => alert('Pictogram clicked!')}
          className="clickable"
        />
        <pre>{`<ArasaacPicto 
  id={20401} 
  size="100px" 
  onClick={() => alert('Pictogram clicked!')}
  className="clickable"
/>`}</pre>
      </section>

      {/* Combined Example */}
      <section style={{ marginBottom: '40px' }}>
        <h2>9. Combined Parameters</h2>
        <ArasaacPicto 
          id={2950}
          size="150px"
          backgroundColor="#e8f5e9"
          hairColor="#f4d03f"
          skinColor="#8d5524"
          alt="Person with custom colors"
        />
        <pre>{`<ArasaacPicto 
  id={2950}
  size="150px"
  backgroundColor="#e8f5e9"
  hairColor="#f4d03f"
  skinColor="#8d5524"
  alt="Person with custom colors"
/>`}</pre>
      </section>

      {/* Common ARASAAC IDs */}
      <section style={{ marginBottom: '40px' }}>
        <h2>10. Common ARASAAC Pictogram IDs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '20px' }}>
          <div>
            <ArasaacPicto id={2950} size="100px" />
            <p style={{ textAlign: 'center', fontSize: '12px' }}>Person (2950)</p>
          </div>
          <div>
            <ArasaacPicto id={20401} size="100px" />
            <p style={{ textAlign: 'center', fontSize: '12px' }}>Believe (20401)</p>
          </div>
          <div>
            <ArasaacPicto id={4331} size="100px" />
            <p style={{ textAlign: 'center', fontSize: '12px' }}>Happy (4331)</p>
          </div>
          <div>
            <ArasaacPicto id={4332} size="100px" />
            <p style={{ textAlign: 'center', fontSize: '12px' }}>Sad (4332)</p>
          </div>
          <div>
            <ArasaacPicto id={2415} size="100px" />
            <p style={{ textAlign: 'center', fontSize: '12px' }}>Help (2415)</p>
          </div>
          <div>
            <ArasaacPicto id={5110} size="100px" />
            <p style={{ textAlign: 'center', fontSize: '12px' }}>School (5110)</p>
          </div>
        </div>
      </section>
    </div>
  );
}

