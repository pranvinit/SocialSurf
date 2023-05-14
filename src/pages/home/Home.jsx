import Share from "../../components/share/Share";
import { Feed } from "../../components/feed/Feed";
import { Sidebar } from "../../components/sidebar/Sidebar";
import styles from "./home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <Share />
      <main>
        <Feed />
        <Sidebar />
      </main>
    </div>
  );
};

export default Home;
