export default async function ZenQuote2() {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    return (
        <div className="pt-[6rem] pl-[6rem] pr-[6rem]">
            <p style={{ fontSize: '1.5rem' }}>{data.q}</p>
            <p style={{ fontSize: '1.0rem', fontStyle: 'italic' }}>- {data.a}</p>
        </div>
    );
}