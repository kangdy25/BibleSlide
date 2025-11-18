import styles from './Sidebar.module.css';
import SearchInput from '../components/SearchInput';
import TextSlider from '../components/TextSlider';
import SelectFont from '../components/SelectFont';
import GeneratePPTButton from '../components/GeneratePPTButton';
import SelectAlign from '../components/SelectAlign';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <SearchInput />
        <SelectFont />
        <SelectAlign />
        <TextSlider />
        <GeneratePPTButton />
      </div>
    </div>
  );
};

export default Sidebar;
