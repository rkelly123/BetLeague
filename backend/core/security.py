from passlib.context import CryptContext

# Configure Passlib to use bcrypt
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

def hash_password(password: str) -> str:
    """
    Hash a password with bcrypt.
    Truncate to 72 characters to avoid bcrypt limitation.
    """
    truncated_password = password[:72]
    hashed = pwd_context.hash(truncated_password)
    return hashed

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against the hashed password.
    Truncate plain password to 72 chars to match hash.
    """
    truncated_password = plain_password[:72]
    return pwd_context.verify(truncated_password, hashed_password)
