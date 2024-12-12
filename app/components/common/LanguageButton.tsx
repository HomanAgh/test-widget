import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  console.log('i18n instance:', i18n); // Log the instance to verify `changeLanguage` exists

  const changeLanguage = (lang: string): void => {
    if (i18n.changeLanguage) {
      i18n.changeLanguage(lang)
        .then(() => console.log(`Language changed to ${lang}`))
        .catch((err) => console.error('Error changing language:', err));
    } else {
      console.error('i18n.changeLanguage is not a function. Check i18n setup.');
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
