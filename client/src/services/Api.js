// Api.js
import { toast } from "react-toastify";

export const HandleSignUp = async (userDetails, setAuthUser) => {
  try {
    const url = "/auth/signup";
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userDetails})
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    localStorage.setItem("logged-user", JSON.stringify(data));
    setAuthUser(data);
    return data;
  } catch (error) {
    toast.error(error.message);
    console.error('Error creating user:', error.message);
    return { error: error.message };
  }
};

export const HandleLogout = async (setAuthUser) => {
  try {
    const res = await fetch("/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    localStorage.removeItem("logged-user");
    setAuthUser(null);
  } catch (error) {
    toast.error(error.message);
  }
};

export const HandleLogin = async (userDetails, setAuthUser) => {
  console.log("api-->", userDetails);
  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userDetails}),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    localStorage.setItem("logged-user", JSON.stringify(data));
    setAuthUser(data);
    return data;
  } catch (error) {
    toast.error(error.message);
    return { error: error.message };
  }
};

export const HandleUsers = async () => {
  try {
    const res = await fetch("/users/allusers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    toast.error(error.message);
    return { error: error.message };
  }
};

export const HandleSendMessage = async (message, id, messages, setMessages) => {
  try {
    if(!message){
      return;
    }
      const res = await fetch(`/message/sendmessage/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({message}),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setMessages([...messages, data]);
      return data;
  } catch (error) {
    toast.error(error.message);
    return { error: error.message };
  }
};

export const HandleGetMessage = async (id, messages, setMessages) => {
  try{
    const res = await fetch(`/message/getmessage/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    setMessages(data);
    return data;
  } catch (error) {
    toast.error(error.message);
    return { error: error.message };
  }
};

export const HandleSetStatus = async (status) => {
  try {
    const url = "/users/status";
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    console.log("User status updated successfully:", data);
  } catch (error) {
    toast.error(error.message);
    console.error('Error setting user status:', error.message);
  }
};
