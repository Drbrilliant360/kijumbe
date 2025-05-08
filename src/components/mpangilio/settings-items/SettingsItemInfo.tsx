
interface SettingsItemInfoProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SettingsItemInfo = ({ icon, title, description }: SettingsItemInfoProps) => {
  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="bg-secondary dark:bg-gray-700 rounded-full p-3 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg dark:text-gray-100">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default SettingsItemInfo;
