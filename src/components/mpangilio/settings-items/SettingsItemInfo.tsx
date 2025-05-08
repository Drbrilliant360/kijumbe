
interface SettingsItemInfoProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SettingsItemInfo = ({ icon, title, description }: SettingsItemInfoProps) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="bg-secondary rounded-full p-3 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default SettingsItemInfo;
