import { FaUserLarge } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Follow from "./Resuable/Follow";
import Loader from "./Loader";

const RightHome = () => {
  const navigate = useNavigate();
  const { userData, loading } = useSelector((state) => state.user);
  const { suggestedUsers } = useSelector((state) => state.user);

  return (
    <div className="w-[30%] hidden md:block border-l bg-bg text-text-primary border-border px-4 h-screen overflow-y-auto fixed right-0 top-0">
      
      {/* user photo and name and id*/}
      <div className="flex items-center gap-2.5 mt-8">
        <div className="h-12 w-12 object-cover overflow-hidden rounded-full border-3 border-primary  flex justify-center items-center bg-gray-500">
          {userData && userData.profileImage ? (
            <img
              src={userData?.profileImage}
              alt={userData?.name}
              className=" object-cover h-full w-full"
            />
          ) : (
            <FaUserLarge className="text-white text-3xl" />
          )}
        </div>
        <div>
          <h2 className="md:text-sm lg:text-lg font-semibold">{userData?.name}</h2>
          <p className="text-sm text-gray-400">@{userData?.username}</p>
        </div>
      </div>

      {/* suggested users */}
      <div className="mt-4 pt-4  border-t border-border">
        <h3 className="text-xl font-semibold mb-4">Suggested people</h3>
        <div className="flex  flex-col gap-4">
          {loading ? (
            <div className=" h-36 flex justify-center items-center">
              {" "}
              <Loader />
            </div>
          ) : suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.slice(0, 3).map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="h-10  w-10 cursor-pointer object-cover overflow-hidden rounded-full border-2 border-primary  flex justify-center items-center bg-gray-500"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className=" object-cover h-full w-full"
                      />
                    ) : (
                      <FaUserLarge className="text-white text-2xl" />
                    )}
                  </div>
                  <div
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="cursor-pointer"
                  >
                    <h4 className="text-md font-medium">{user.name}</h4>
                  </div>
                </div>
                <Follow userId={user._id} />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No suggested users available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightHome;
