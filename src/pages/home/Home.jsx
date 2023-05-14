import Share from "../../components/share/Share";
import { Feed } from "../../components/feed/Feed";
import styles from "./home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <Share />
      <Feed />
    </div>
  );
};

export default Home;
