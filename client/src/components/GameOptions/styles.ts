// styles.ts
import styled from "styled-components";

// Define the black/dark gray theme with red accents
const colors = {
  background: '#000000',
  containerBackground: '#1a1d21',
  containerBackgroundGradient: 'linear-gradient(145deg, #212428, #15171a)',
  border: '#33383f',
  textPrimary: '#e8e8e8',
  textSecondary: '#8a9199',
  accentPrimary: '#c70039',
  accentHover: '#ff195d', // Brighter red - used for icon/hover
  accentFocusOutline: 'rgba(255, 25, 93, 0.6)',
  inputBackground: '#2c3035',
  shadowColor: 'rgba(0, 0, 0, 0.6)',
  separatorLine: '#4a4e53',
  titleShadow: 'rgba(0, 0, 0, 0.8)',
  titleGlow: 'rgba(255, 25, 93, 0.15)',
};

export const Wrapper = styled.div`
  min-height: 100vh;
  background: ${colors.background};
  color: ${colors.textPrimary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
  overflow-x: hidden;
`;

export const Container = styled.div`
  background: ${colors.containerBackground};
  background: ${colors.containerBackgroundGradient};
  border: 1px solid ${colors.border};
  box-shadow: 0px 10px 30px ${colors.shadowColor};
  max-width: 480px;
  width: 100%;
  padding: 2.5rem 3rem 3rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  gap: 2.5rem;
  animation: fadeInScale 0.5s ease-out forwards;

  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .title-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: -0.5rem;
    width: 100%;
  }

  // --- Updated Icon Styling ---
  .title-container .title-icon {
    width: 42px;                      // Adjust size if needed
    height: 42px;                     // Use explicit height too
    stroke: ${colors.accentHover};    // *** Use stroke for Lucide icons ***
    stroke-width: 2;                  // Default Lucide stroke width (adjust 1.5, 2.5 etc. if desired)
    margin-bottom: 0.2rem;
    filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.5)); // Slightly adjusted shadow
  }
  // --- End Updated Icon Styling ---

  h1 {
    font-size: 2.3rem;
    color: #ffffff;
    text-align: center;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin: 0;
    line-height: 1.2;
    text-shadow:
      1px 1px 2px ${colors.titleShadow},
      0 0 10px ${colors.titleGlow},
      0 0 5px ${colors.titleGlow};
  }

  .separator { /* ... unchanged ... */
    display: flex; align-items: center; text-align: center;
    color: ${colors.textSecondary}; width: 90%; margin: -1rem 0;
    &::before, &::after { content: ''; flex: 1; border-bottom: 1px solid ${colors.separatorLine}; }
    span { font-size: 0.9rem; text-transform: uppercase; font-weight: 500; padding: 0 1em; line-height: 1; }
  }

  button { /* ... unchanged ... */
    padding: 0.9rem 2rem; border: none; border-radius: 10px;
    background: ${colors.accentPrimary}; color: white; font-size: 1.1rem;
    font-weight: 600; cursor: pointer;
    transition: background-color 0.2s ease-in-out, transform 0.15s ease, box-shadow 0.2s ease;
    width: 100%; max-width: 320px; text-transform: uppercase; letter-spacing: 0.8px;
    &:hover { background: ${colors.accentHover}; transform: translateY(-3px) scale(1.02); box-shadow: 0 6px 15px rgba(199, 0, 57, 0.4); }
    &:active { transform: translateY(-1px) scale(1); box-shadow: 0 2px 8px rgba(199, 0, 57, 0.3); }
    &:focus-visible { outline: 3px solid ${colors.accentFocusOutline}; outline-offset: 2px; background: ${colors.accentHover}; }
  }

  .join-section { /* ... unchanged ... */
    display: flex; gap: 1rem; width: 100%; align-items: stretch;
    @media (max-width: 450px) { flex-direction: column; }
  }

  input[type="text"] { /* ... unchanged ... */
    padding: 0.9rem 1.1rem; border: 1px solid ${colors.border}; border-radius: 10px;
    font-size: 1rem; background-color: ${colors.inputBackground}; color: ${colors.textPrimary};
    flex-grow: 1; transition: border-color 0.2s ease, box-shadow 0.2s ease; min-width: 100px;
    &::placeholder { color: ${colors.textSecondary}; opacity: 0.7; }
    &:focus { outline: none; border-color: ${colors.accentHover}; box-shadow: 0 0 0 3px ${colors.accentFocusOutline}; }
  }

  .join-section > button { /* ... unchanged ... */
     width: auto; max-width: none; flex-shrink: 0; background: ${colors.accentPrimary};
     &:hover { background: ${colors.accentHover}; }
     @media (max-width: 450px) { width: 100%; margin-top: 0.5rem; }
  }
`;