import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string): void => {
    if (i18n.changeLanguage) {
      i18n.changeLanguage(lang); // Ensure the method exists
    } else {
      console.error("i18n.changeLanguage is not a function. Check i18n setup.");
    }
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('sv')}>Svenska</button>
    </div>
  );
};

export default LanguageSwitcher;
