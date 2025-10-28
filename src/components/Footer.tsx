export const Footer = () => {
  return (
    <footer className="bg-accent p-4">
      <p className="text-center text-foreground">
        &copy; {new Date().getFullYear()} Cooking Book App. All rights reserved.
      </p>
    </footer>
  );
};
