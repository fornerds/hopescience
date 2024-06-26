import { getApi, putApi, deleteApi, postApi, patchApi } from "../api/index";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      register: async (name, phone, email, password) => {
        set({ isLoading: true });
        try {
          const response = await postApi({
            path: "/users",
            data: {
              name,
              phone,
              email,
              password,
              user_type: "user",
            },
          });
          if (response) {
            set({ isLoading: false });
            alert(
              "회원가입이 성공적으로 완료되었습니다. 가입한 계정으로 다시 로그인해주세요."
            );
            return true;
          }
        } catch (error) {
          set({ error: error.response.data.message, isLoading: false });
          alert("회원가입 실패: " + error.response.data.message);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await postApi({
            path: "/users/login",
            data: { email, password },
          });
          if (!response) throw new Error("No response from server");
          const {
            access_token,
            refresh_token,
            user_id,
            name,
            user_type,
            uuid,
          } = response;
          set({
            user: { userId: user_id, name, userType: user_type, uuid},
            accessToken: access_token,
            refreshToken: refresh_token,
            isLoading: false,
          });
          alert(`로그인 성공! ${name}님 환영합니다!`);
          return true;
        } catch (err) {
          console.error("Login Error:", err);
          set({ error: err.message || "Login failed", isLoading: false });
          alert("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await postApi({
            path: "/users/logout",
          });
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
          });
          sessionStorage.clear();
          alert("로그아웃되었습니다.");
        } catch (error) {
          set({ error: error.message, isLoading: false });
          alert("로그아웃 실패: " + error.message);
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken, logout } = get();

        if (!refreshToken) {
          console.error("No refresh token available.");
          return;
        }

        set({ isLoading: true });
        try {
          const response = await postApi({
            path: "/users/refresh",
            data: { refresh_token: refreshToken },
          });
          if (response.access_token) {
            set({
              accessToken: response.access_token,
              refreshToken: response.refresh_token || refreshToken, // 새로운 refresh 토큰이 있다면 업데이트
              isLoading: false,
            });
            alert("액세스 토큰이 성공적으로 갱신되었습니다.");
          } else {
            throw new Error("토큰 갱신에 실패하였습니다.");
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
            logout();
          }
          // console.error("Refresh Token Error:", error);
          set({ error: error.message || "토큰 갱신 실패", isLoading: false });
          alert("토큰 갱신 실패: " + error.message);
        }
      },

      adminLogin: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await postApi({
            path: "/users/login",
            data: {
              email,
              password,
            },
          });
          const { access_token, refresh_token, user_id, name, user_type } =
            response;
          if (user_type === "admin") {
            set({
              user: { userId: user_id, name, userType: user_type },
              accessToken: access_token,
              refreshToken: refresh_token,
              isLoading: false,
            });
            alert(`로그인 성공! ${name}님 환영합니다!`);
            return true;
          } else {
            throw new Error(
              "관리자 계정의 아이디, 비밀번호가 아닙니다. 다시 시도해주세요."
            );
          }
        } catch (error) {
          set({ error: error.message || "Login failed", isLoading: false });
          return false;
        }
      },

      naverLogin: async (accessToken, tokenType, expiresIn, state) => {
        set({ isLoading: true });
        try {
          const response = await postApi({
            path: "/users/naver-login",
            data: {
              access_token: accessToken,
              token_type: tokenType,
              expires_in: expiresIn,
              state,
            },
          });
          if (response) {
            const { access_token, refresh_token, user_id, name, user_type } = response;
            set({
              user: {
                accessToken: access_token,
                refreshToken: refresh_token,
                userId: user_id,
                name: name,
                userType: user_type,
              },
              isLoading: false,
              token: access_token,
            });
            alert(`로그인 성공! ${name}님 환영합니다!`);
            return response;
          } else {
            alert("Invalid response from server");
            throw new Error("Invalid response from server");
          }
        } catch (error) {
          set({ error: error.message, isLoading: false });
          alert("네이버 로그인 실패: " + error.message);
          throw new Error("네이버 로그인 실패: " + error.message);
        }
      },

      updatePassword: async (password, newPassword, accessToken) => {
        set({ isLoading: true });
        try {
          await postApi({
            path: "/users/change-password",
            data: { current_password: password, new_password: newPassword },
          });
          set({ isLoading: false });
          alert("비밀번호가 정상적으로 변경되었습니다.");
        } catch (error) {
          set({ error: error.message, isLoading: false });
          alert("비밀번호 변경 실패: " + error.message);
        }
      },

      signout: async (userId) => {
        set({ isLoading: true });
        try {
          await deleteApi({
            path: `/users/${userId}`,
          });
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
          });
          alert("계정이 삭제되었습니다.");
        } catch (error) {
          set({ error: error.message, isLoading: false });
          alert("계정 삭제 실패: " + error.message);
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => sessionStorage,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate auth state:", error);
        }
      },
    }
  )
);

const usePaymentStore = create((set) => ({
  isLoading: false,
  error: null,
  payments: [],

  createPayment: async (orderId, amount, userId, courseId) => {
    set({ isLoading: true });
    try {
      const response = await postApi({
        path: "/payments/create",
        data: {
          order_id: orderId,
          amount,
          user_id: userId,
          course_id: courseId,
        },
      });

      alert(`결제 정보 저장: 주문번호 ${orderId}`);
      set({ isLoading: false });
      return response;
    } catch (err) {
      set({
        error: err.message || "결제 처리 중 오류가 발생했습니다",
        isLoading: false,
      });
      alert(err.message || "결제 처리 중 오류가 발생했습니다");
    }
  },

  confirmPayment: async (orderId, paymentKey, amount) => {
    set({ isLoading: true });
    try {
      const response = await postApi({
        path: "/payments/confirm",
        data: {
          order_id: orderId,
          paymentKey,
          amount: amount,
        },
      });

      if (response) {
        alert(`결제 성공: 주문번호 ${orderId}`);
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      set({
        error: error.message || "결제 처리 중 오류가 발생했습니다",
        isLoading: false,
      });
      alert(error.message || "결제 처리 중 오류가 발생했습니다");
      return false;
    }
  },

  getPayments: async () => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: "/payments" });
      if (response) {
        set({
          payments: response,
          isLoading: false,
        });
        console.log("결제 데이터를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch users: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert(
        "결제 데이터를 가져오는 중 오류가 발생했습니다: " + error.message
      );
    }
  },
}));

const useUserStore = create((set) => ({
  users: [],
  profile: null,
  isLoading: false,
  error: null,

  getUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: "/users" });
      if (response) {
        set({
          users: response.map((user) => ({
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            userType: user.user_type,
            id: user.id,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          })),
          isLoading: false,
        });
        console.log("사용자 데이터를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch users: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert(
        "사용자 데이터를 가져오는 중 오류가 발생했습니다: " + error.message
      );
    }
  },

  searchUsers: async (keyword) => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: "/users/?skip=0&limit=100&keyword=" + keyword});
      if (response) {
        set({
          users: response.map((user) => ({
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            userType: user.user_type,
            id: user.id,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
          })),
          isLoading: false,
        });
        console.log("사용자 데이터를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch users: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert(
        "사용자 데이터를 가져오는 중 오류가 발생했습니다: " + error.message
      );
    }
  },

  getUser: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: `/users/${userId}` });
      if (response) {
        set({
          profile: {
            uuid: response.uuid,
            name: response.name,
            email: response.email,
            phone: response.phone,
            userType: response.user_type,
            id: response.id,
            createdAt: response.created_at,
            updatedAt: response.updated_at,
          },
          isLoading: false,
        });
        console.log("사용자 데이터를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch users: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert(
        "사용자 데이터를 가져오는 중 오류가 발생했습니다: " + error.message
      );
    }
  },

  updateUser: async (userId, uuid, email, name, phone) => {
    set({ isLoading: true });
    try {
      const response = await patchApi({
        path: `/users/${userId}`,
        data: {
          uuid,
          name,
          email,
          phone,
          user_type: "user",
        },
      });
      if (response) {
        alert("회원 정보를 성공적으로 변경했습니다.");
        set({ isLoading: false });
      } else {
        throw new Error(`Failed to update users: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("회원 정보를 변경하는 중 오류가 발생했습니다: " + error.message);
    }
  },
}));

const useServiceStore = create((set) => ({
  isUploadLoading: false,
  isUploadThumbnailLoading: false,
  isLoading: false,
  error: null,
  services: [],
  course: null,
  lecture: null,
  categories: [],
  groups: [],

  createService: async (formData) => {
    set({ isLoading: true });
    try {
      // 구조 분해 할당을 사용하여 formData에서 필요한 데이터를 추출
      const {
        title,
        description,
        summary,
        category_id,
        group_id,
        category,
        group,
        thumbnail_image,
        total_duration,
        total_lecture_count,
        price,
        discounted_price,
        is_active,
        sections,
      } = Object.fromEntries(formData.entries());

      const data = {
        title,
        description,
        summary,
        category_id,
        group_id,
        category,
        group,
        thumbnail_image: thumbnail_image || null,
        total_duration: total_duration || "00:00:00",
        total_lecture_count: total_lecture_count || 0,
        price,
        discounted_price,
        is_active,
        duration_start: "2024-06-16",
        duration_end: "2024-06-16",
        sections: JSON.parse(sections).map((section) => ({
          title: section.title,
          description: "",
          order: section.order,
          lectures: section.lectures.map((lecture) => ({
            title: lecture.title,
            video_url: lecture.videoUrl,
            video_duration: lecture.videoDuration,
            order: lecture.order,
          })),
        })),
      };

      const response = await postApi({
        path: "/courses",
        data: JSON.stringify(data),
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) {
        alert("서비스가 성공적으로 등록되었습니다.");
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      console.error("Service Creation Error:", error);
      set({
        error: error.response?.data?.message || "서비스 등록 실패",
        isLoading: false,
      });
      alert(
        "서비스 등록 실패: " + (error.response || error.message)
      );
      return false;
    }
  },

  getServices: async () => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: "/courses" });
      if (response) {
        set({
          services: response.map((service) => ({
            id: service.id,
            title: service.title,
            category: service.category,
            group: service.group,
            price: service.price,
            thumbnail: service.thumbnail_image,
            discounted_price: service.discounted_price,
            created_at: service.created_at,
            is_active: service.is_active,
          })),
          isLoading: false,
        });
        console.log("서비스 리스트를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch services: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert(
        "서비스 리스트를 가져오는 중 오류가 발생했습니다: " + error.message
      );
    }
  },

  searchServices: async (keyword) => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: `/courses/?skip=0&limit=100&title=${keyword}` });
      if (response) {
        set({
          services: response.map((service) => ({
            id: service.id,
            title: service.title,
            category: service.category,
            group: service.group,
            price: service.price,
            thumbnail: service.thumbnail_image,
            discounted_price: service.discounted_price,
            created_at: service.created_at,
            is_active: service.is_active,
          })),
          isLoading: false,
        });
        console.log("서비스 리스트를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch services: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert(
        "서비스 리스트를 가져오는 중 오류가 발생했습니다: " + error.message
      );
    }
  },

  sortbyCategoryServices: async (category) => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: `/courses/?skip=0&limit=100&category=${category}` });
      if (response) {
        set({
          services: response.map((service) => ({
            id: service.id,
            title: service.title,
            category: service.category,
            group: service.group,
            price: service.price,
            thumbnail: service.thumbnail_image,
            discounted_price: service.discounted_price,
            created_at: service.created_at,
            is_active: service.is_active,
          })),
          isLoading: false,
        });
        console.log("서비스 리스트를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch services: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert(
        "서비스 리스트를 가져오는 중 오류가 발생했습니다: " + error.message
      );
    }
  },

  getService: async (course_id) => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: `/courses/${course_id}` });
      if (response) {

        // 서버의 video_url 이름을 프론트의 videoUrl로 통합
        const transformedCourse = {
          ...response,
          thumbnail: response.thumbnail_image,
          sections: response.sections.map((section) => ({
            ...section,
            lectures: section.lectures.map((lecture) => ({
              ...lecture,
              videoUrl: lecture.video_url,
            })),
          })),
        };

        set({
          course: transformedCourse,
          isLoading: false,
        });
        console.log("해당 서비스를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch services: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("해당 서비스를 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  getCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: "/courses/categories" });
      if (response) {
        set({
          categories: response.map((category) => ({
            id: category.id,
            name: category.name,
          })),
          isLoading: false,
        });
        console.log("카테고리를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(
          `Failed to fetch categories: Status ${response.status}`
        );
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("getCategories Error:", error);
      alert("카테고리를를 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  getGroups: async () => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: "/courses/groups" });
      if (response) {
        set({
          groups: response.map((group) => ({
            id: group.id,
            name: group.name,
          })),
          isLoading: false,
        });
        console.log("서비스 그룹을 성공적으로 가져왔습니다.");
      } else {
        throw new Error(
          `Failed to fetch categories: Status ${response.status}`
        );
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("getCategories Error:", error);
      alert("서비스 그룹을 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  updateService: async (course_id, formData) => {
    set({ isLoading: true });
    try {
      // 구조 분해 할당을 사용하여 formData에서 필요한 데이터를 추출
      const {
        title,
        description,
        summary,
        category_id,
        group_id,
        category,
        group,
        thumbnail_image,
        total_duration,
        total_lecture_count,
        price,
        discounted_price,
        is_active,
        sections,
      } = Object.fromEntries(formData.entries());

      const data = {
        title,
        description,
        summary,
        category_id,
        group_id,
        category,
        group,
        thumbnail_image: thumbnail_image || null,
        total_duration: total_duration || "00:00:00",
        total_lecture_count: total_lecture_count || 0,
        price,
        discounted_price,
        is_active,
        sections: JSON.parse(sections).map((section) => ({
          title: section.title,
          description: "",
          order: section.order,
          lectures: section.lectures.map((lecture) => ({
            title: lecture.title,
            video_url: lecture.videoUrl,
            video_duration: lecture.videoDuration,
            order: lecture.order,
          })),
        })),
      };

      const response = await putApi({
        path: `/courses/${course_id}`,
        data: JSON.stringify(data),
      });

      if (response) {
        alert("서비스가 성공적으로 업데이트되었습니다.");
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      console.error("Service Creation Error:", error);
      set({
        error: error.response?.data?.message || "서비스 업데이트 실패",
        isLoading: false,
      });
      alert(
        "서비스 업데이트 실패: " +
          (error.response?.data?.message || error.message)
      );
      return false;
    }
  },

  deleteService: async (course_id) => {
    set({ isLoading: true });
    try {
      const response = await deleteApi({ path: `/courses/${course_id}` });
      if (response) {
        console.log("해당 서비스를 성공적으로 삭제했습니다.");
        set({ isLoading: false });
        return true;
      } else {
        throw new Error(`Failed to delete service: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert(`서비스 삭제 중 오류가 발생했습니다: ${error.message}`);
      return false;
    }
  },

  updateServiceActive: async (course_id, is_active) => {
    try {
      const response = await patchApi({
        path: `/courses/${course_id}/active`,
        data: JSON.stringify({ is_active }),
      });
      if (response) {
        console.log(`서비스 상태가 성공적으로 ${is_active ? '활성화' : '비활성화'}되었습니다.`);
        return true;
      } else {
        throw new Error(`Failed to update service status: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message });
      alert(`서비스 상태 변경 중 오류가 발생했습니다: ${error.message}`);
      return false;
    }
  },

  getLecture: async (lecture_id) => {
    set({ isLoading: true });
    try {
      const response = await getApi({
        path: `/courses/lectures/${lecture_id}`,
      });
      if (response) {
        set({
          lecture: response,
          isLoading: false,
        });
        console.log("해당 강의를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch lecture: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("해당 강의를 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  clearCourse: () => {
    set({ course: null });
  },

  uploadVideo: async (formData) => {
    set({ isUploadLoading: true });
    try {
      const videos = Object.fromEntries(formData.entries());

      alert(JSON.stringify(videos));
      const response = await postApi({
        path: "/courses/video",
        data: JSON.stringify(videos),
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) {
        console.log("Server Response:", response); // 서버 응답 확인
        alert("비디오가 성공적으로 업로드되었습니다.");
        set({ isUploadLoading: false });
        return response;
      }
    } catch (error) {
      console.error("Video Upload Error:", error);
      set({
        error: error.response?.data?.message || "비디오 업로드 실패",
        isUploadLoading: false,
      });
      alert("비디오 업로드 실패: " + (error.response?.data?.message || error.message));
      return false;
    }
  },

  uploadThumbnail: async (formData, course_id) => {
    set({ isUploadThumbnailLoading: true });
    try {
      const { thumbnail } = Object.fromEntries(formData.entries());

      const data = {
        thumbnail,
      };

      const response = await postApi({
        path: `/courses/${course_id}/thumbnail`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response) {
        console.log("Server Response:", response); // 서버 응답 확인
        alert("이미지가 성공적으로 업로드되었습니다.");
        set({ isUploadThumbnailLoading: false });
        return response;
      }
    } catch (error) {
      console.error("Thumbnail Upload Error:", error);
      set({
        error: error.response?.data?.message || "이미지 업로드 실패",
        isUploadThumbnailLoading: false,
      });
      alert("이미지 업로드 실패: " + (error.response?.data?.message || error.message));
      return false;
    }
  }

}));

const useInquiryStore = create((set) => ({
  isLoading: false,
  error: null,
  inquiries: [],
  QnA: null,

  getInquiries: async () => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: "/inquiries" });
      if (response) {
        set({
          inquiries: response
            .map((inquiry) => ({
              id: inquiry.id,
              title: inquiry.title,
              category: inquiry.category,
              created_at: inquiry.created_at,
              updated_at: inquiry.updated_at,
              content: inquiry.content,
              user_id: inquiry.user_id,
              user_name: inquiry.user_name,
              view_count: inquiry.view_count,
              comments: inquiry.comments,
            }))
            .sort((a, b) => b.id - a.id),
          isLoading: false,
        });
        console.log("질문 리스트를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch inquiries: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("질문 리스트를 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  searchInquiries: async (keyword) => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: "/inquiries/?skip=0&limit=100&keyword=" + keyword });
      if (response) {
        set({
          inquiries: response
            .map((inquiry) => ({
              id: inquiry.id,
              title: inquiry.title,
              category: inquiry.category,
              created_at: inquiry.created_at,
              updated_at: inquiry.updated_at,
              content: inquiry.content,
              user_id: inquiry.user_id,
              user_name: inquiry.user_name,
              view_count: inquiry.view_count,
              comments: inquiry.comments,
            }))
            .sort((a, b) => b.id - a.id),
          isLoading: false,
        });
        console.log("질문 리스트를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch inquiries: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("질문 리스트를 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  getInquiry: async (inquiry_id) => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: `/inquiries/${inquiry_id}` });
      if (response) {
        set({
          QnA: response,
          isLoading: false,
        });
        console.log("질문을 성공적으로 가져왔습니다.");
        const sortedComments = response.comments.sort((a, b) => a.id - b.id);
        response.comments = sortedComments;
      } else {
        throw new Error(`Failed to fetch inquiry: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("질문을 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  createInquiry: async (userId, title, category, content) => {
    set({ isLoading: true });
    try {
      const response = await postApi({
        path: `/inquiries/?user_id=${userId}`,
        data: {
          title,
          category,
          content,
        },
      });
      if (response?.id) {
        set({ isLoading: false });
        alert("문의가 정상적으로 접수되었습니다.");
        return true;
      }
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      alert("문의 등록 실패: " + error.response.data.message);
    }
  },

  updateInquiry: async (inquiry_id, title, category, content) => {
    set({ isLoading: true });
    try {
      const response = await putApi({
        path: `/inquiries/${inquiry_id}`,
        data: {
          title,
          category,
          content,
        },
      });
      if (response) {
        set({ isLoading: false });
        alert("문의가 정상적으로 수정되었습니다.");
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("문의 수정 실패: " + error.message);
    }
  },

  deleteInquiry: async (inquiry_id) => {
    set({ isLoading: true });
    try {
      const response = await deleteApi({
        path: `/inquiries/${inquiry_id}`,
      });
      if (response) {
        set({ isLoading: false });
        alert("문의가 정상적으로 삭제되었습니다.");
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("문의 삭제 실패: " + error.message);
    }
  },

  createComment: async (inquiry_id, user_id, content) => {
    set({ isLoading: true });
    try {
      const response = await postApi({
        path: `/inquiries/${inquiry_id}/comments?user_id=${user_id}`,
        data: {
          content,
        },
      });
      if (response?.id) {
        set({ isLoading: false });
        alert("댓글을 등록했습니다.");
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("댓글 등록 실패: " + error.message);
    }
  },

  updateComment: async (comment_id, content) => {
    set({ isLoading: true });
    try {
      const response = await putApi({
        path: `/inquiries/comments/${comment_id}`,
        data: {
          content,
        },
      });
      if (response) {
        set({ isLoading: false });
        alert("댓글이 정상적으로 수정되었습니다.");
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("댓글 수정 실패: " + error.message);
    }
  },

  deleteComment: async (comment_id) => {
    set({ isLoading: true });
    try {
      const response = await deleteApi({
        path: `/inquiries/comments/${comment_id}`,
      });
      if (response) {
        set({ isLoading: false });
        alert("댓글이 정상적으로 삭제되었습니다.");
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("댓글 삭제 실패: " + error.message);
    }
  },

  clearQnA: () => {
    set({ QnA: null });
  },
}));

const useCourseInquiryStore = create((set) => ({
  isLoading: false,
  error: null,
  courseInquiries: [],
  courseQnA: null,

  getCourseInquiries: async (course_id) => {
    set({ isLoading: true });
    try {
      const response = await getApi({ path: `/courses/${course_id}/qna` });
      if (response) {
        set({
          courseInquiries: response
            .map((inquiry) => ({
              id: inquiry.id,
              course_id: course_id,
              user_id: inquiry.user_id,
              title: inquiry.title,
              content: inquiry.content,
              created_at: inquiry.created_at,
              updated_at: inquiry.updated_at,
              view_count: inquiry.view_count,
              user_name: inquiry.user_name,
              comments: inquiry.comments,
              lecture_id: inquiry.lecture_id,
              category: inquiry.category,
            }))
            .sort((a, b) => b.id - a.id),
          isLoading: false,
        });
        console.log("질문 리스트를 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch inquiries: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("질문 리스트를 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  getCourseInquiry: async (course_id, qna_id) => {
    set({ isLoading: true });
    try {
      const response = await getApi({
        path: `/courses/${course_id}/qna/${qna_id}`,
      });
      if (response) {
        set({
          courseQnA: response,
          isLoading: false,
        });
        const sortedComments = response.comments.sort((a, b) => a.id - b.id);
        response.comments = sortedComments;
        console.log("질문을 성공적으로 가져왔습니다.");
      } else {
        throw new Error(`Failed to fetch inquiry: Status ${response.status}`);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("질문을 가져오는 중 오류가 발생했습니다: " + error.message);
    }
  },

  createCourseInquiry: async (
    course_id,
    lecture_id,
    title,
    content,
    accessToken
  ) => {
    set({ isLoading: true });
    try {
      const response = await postApi({
        path: `/courses/${course_id}/qna/?lecture_id=${lecture_id}`,
        data: {
          title,
          content,
        },
        access_token: accessToken,
      });
      if (response?.id) {
        set({ isLoading: false });
        alert("문의가 정상적으로 접수되었습니다.");
        return true;
      } else {
        throw new Error("서버에서 문의를 처리하지 못했습니다.");
      }
    } catch (error) {
      // console.error("Error Data:", JSON.stringify(error.response || error));
      set({ error: error.message, isLoading: false });
      alert("문의 등록 실패: " + error.message);
      throw error;
    }
  },

  updateCourseInquiry: async (course_id, qna_id, title, content) => {
    set({ isLoading: true });
    try {
      const response = await putApi({
        path: `/courses/${course_id}/qna/${qna_id}`,
        data: {
          title,
          content,
        },
      });
      if (response) {
        set({ isLoading: false });
        alert("문의가 정상적으로 수정되었습니다.");
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("문의 수정 실패: " + error.message);
    }
  },

  deleteCourseInquiry: async (course_id, qna_id) => {
    set({ isLoading: true });
    try {
      const response = await deleteApi({
        path: `/courses/${course_id}/qna/${qna_id}`,
      });
      if (response) {
        set({ isLoading: false });
        alert("문의가 정상적으로 삭제되었습니다.");
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("문의 삭제 실패: " + error.message);
    }
  },

  createCourseComment: async (course_id, qna_id, content, accessToken) => {
    set({ isLoading: true });
    try {
      const response = await postApi({
        path: `/courses/${course_id}/qna/${qna_id}/comments`,
        data: {
          content,
        },
        access_token: accessToken,
      });
      if (response?.id) {
        set({ isLoading: false });
        alert("댓글을 등록했습니다.");
        return true;
      } else {
        throw new Error("서버에서 문의를 처리하지 못했습니다.");
      }
    } catch (error) {
      console.error("Error Data:", JSON.stringify(error.response || error));
      set({ error: error.message, isLoading: false });
      alert("문의 등록 실패: " + error.message);
      throw error;
    }
  },

  updateCourseComment: async (course_id, qna_id, comment_id, content) => {
    set({ isLoading: true });
    try {
      const response = await putApi({
        path: `/courses/${course_id}/qna/${qna_id}/comments/${comment_id}`,
        data: {
          content,
        },
      });
      if (response) {
        set({ isLoading: false });
        alert("댓글이 정상적으로 수정되었습니다.");
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("댓글 수정 실패: " + error.message);
    }
  },

  deleteCourseComment: async (course_id, qna_id, comment_id) => {
    set({ isLoading: true });
    try {
      const response = await deleteApi({
        path: `/courses/${course_id}/qna/${qna_id}/comments/${comment_id}`,
      });
      if (response) {
        set({ isLoading: false });
        alert("댓글이 정상적으로 삭제되었습니다.");
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      alert("댓글 삭제 실패: " + error.message);
    }
  },

  clearCourseQnA: () => {
    set({ courseQnA: null });
  },
}));
export const courseInquiry = useCourseInquiryStore;
export const inquiry = useInquiryStore;
export const user = useUserStore;
export const payment = usePaymentStore;
export const auth = useAuthStore;
export const service = useServiceStore;
